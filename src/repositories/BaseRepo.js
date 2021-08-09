const shortUUID = require("short-uuid");
const _ = require("lodash");
const { raw } = require("objection");
const { ApplicationException } = require("../exceptions/index");
const numberifyObjKeys = require("../utils/numberifyObjKeys");

const addID = (obj) => ({ ...obj, id: obj.id ? obj.id : shortUUID.generate() });

class BaseRepo {
  constructor(Model, domainMeta) {
    this.Model = Model;
    this.domainMeta = domainMeta;
    this.__SEARCH_COLUMNS = [];
  }

  rejectWithIDNotFound(errorMsg) {
    return { message: errorMsg || `${capitalize(this.domainMeta.singularName)} does not exist` };
  }

  rejectWithRowForAttrsNotFound(attr, errorMsg) {
    return { message: errorMsg || this._generateAttrError(attr) };
  }

  async add(data) {
    const dataToAdd = Array.isArray(data) ? data.map(addID) : addID(data);
    const modelInstance = await this.Model.query().insertAndFetch(dataToAdd);
    return this.modelToJSON(modelInstance);
  }

  async addMany(data = []) {
    if (!data.length) return [];
    return await this.add(data);
  }

  async updateById(id, data, errorMsg) {
    const modelInstance = await this.Model.query()
      .patchAndFetchById(id, { ...data, id: undefined })
      .throwIfNotFound(this.rejectWithIDNotFound(errorMsg));
    return this.modelToJSON(modelInstance);
  }

  async getById(id, errorMsg) {
    if (!id) throw new ApplicationException("DB cannot be queried, ID is undefined");
    const modelInstance = await this.Model.query()
      .findById(id)
      .whereNotDeleted()
      .throwIfNotFound(this.rejectWithIDNotFound(errorMsg));
    return this.modelToJSON(modelInstance);
  }

  async getByAttributes(attr = {}, errorMsg) {
    const modelInstance = await this._addWhereAttributes(this.Model.query(), attr)
      .skipUndefined()
      .whereNotDeleted()
      .first()
      .throwIfNotFound(this.rejectWithRowForAttrsNotFound(attr, errorMsg));
    return this.modelToJSON(modelInstance);
  }

  async getAll() {
    const modelInstance = await this.Model.query().orderBy("cId", "desc").whereNotDeleted();
    return this.modelToJSON(modelInstance);
  }

  async getAllByAttributes(attr = {}) {
    const modelInstance = await this._addWhereAttributes(this.Model.query(), attr)
      .orderBy("cId", "desc")
      .skipUndefined()
      .whereNotDeleted();
    return this.modelToJSON(modelInstance);
  }

  async getMany(listOpts) {
    const modelInstance = await this._getListOptsQuery(listOpts).whereNotDeleted();
    return this.modelToJSON(modelInstance);
  }

  async getManyByAttributes(attr = {}, listOpts) {
    const modelInstance = await this._addWhereAttributes(this._getListOptsQuery(listOpts), attr)
      .skipUndefined()
      .whereNotDeleted();
    return this.modelToJSON(modelInstance);
  }

  async getLatestEntry() {
    const modelInstance = await this.Model.query()
      .skipUndefined()
      .whereNotDeleted()
      .orderBy("cId", "desc")
      .first();
    return this.modelToJSON(modelInstance);
  }

  async recordExistsForId(id) {
    if (!id) throw new ApplicationException("DB cannot be queried, ID is undefined");
    const modelInstance = await this.Model.query().findById(id).whereNotDeleted();
    return Boolean(this.modelToJSON(modelInstance));
  }

  async recordExistForAttributes(attr = {}) {
    const record = await this._addWhereAttributes(this.Model.query(), attr)
      .select("id")
      .whereNotDeleted()
      .first();
    return !!record;
  }

  _isInstanceOfModel(modelInstance) {
    return modelInstance instanceof this.Model;
  }

  modelToJSON(singleOrListModel) {
    if (Array.isArray(singleOrListModel)) {
      return singleOrListModel.map((m) => (this._isInstanceOfModel(m) ? numberifyObjKeys(m.toJSON()) : m));
    }
    return this._isInstanceOfModel(singleOrListModel)
      ? numberifyObjKeys(singleOrListModel.toJSON())
      : singleOrListModel;
  }

  _getListOptsQuery(listOpts, listOptsData) {
    const parentTableName = this.Model.tableName;
    const {
      search,
      take = 20,
      cursor = Infinity,
      page,
      startDate,
      endDate,
      order = true,
      dateRangeColumnName = "createdAt",
    } = listOpts || {};
    const { searchColumns = ["id"] } = listOptsData || {};
    const baseQuery = this.Model.query();
    if (search) {
      const searchTermToUse = String(search).toLowerCase().trim();
      const columns = Array.from(new Set([...this.__SEARCH_COLUMNS, ...searchColumns]));
      let searchColumnsToUse = columns.map((c) => (c.includes(".") ? c : `${parentTableName}.${c}`));
      baseQuery.where((query) => {
        const [firstColumn, ...otherColumns] = searchColumnsToUse;
        query.where(raw(`trim(lower(??))`, [firstColumn]), searchTermToUse);
        otherColumns.forEach((c) => query.orWhere(raw(`trim(lower(??))`, [c]), searchTermToUse));
      });
    }
    if (startDate || endDate) {
      baseQuery.where((query) =>
        query
          .where(raw(`date(??)`, [`${parentTableName}.${dateRangeColumnName}`]), ">=", new Date(startDate))
          .andWhere(raw(`date(??)`, [`${parentTableName}.${dateRangeColumnName}`]), "<=", new Date(endDate))
      );
    }
    if (typeof page === "number" && page > 0) {
      baseQuery.offset(take * (page - 1));
    } else {
      if (cursor && cursor < Infinity) baseQuery.where(`${parentTableName}.cId`, "<", cursor);
    }
    if (order) baseQuery.orderBy(`${parentTableName}.cId`, "desc");
    if (take < Infinity) baseQuery.limit(take);
    return baseQuery;
  }

  _generateAttrError(attr) {
    const idInAttr = attr.id ? ` with id: ${attr.id} ` : "";
    const keyList = Object.keys(attr);
    const keyItems = keyList
      .filter((k) => k !== "id")
      .map((k) => k.replace("Id", ""))
      .join(", ");
    let errorMsg = `${capitalize(
      this.domainMeta.singularName
    )}${idInAttr} is not associated with ${keyItems}`;

    //if there is only 1 key present and it's not the "id" key
    if (!idInAttr && keyList.length === 1) {
      errorMsg = `No ${capitalize(this.domainMeta.singularName)} is associated with ${keyItems}: ${
        attr[keyList[0]]
      }`;
    }
    return errorMsg;
  }

  _addWhereAttributes(query = {}, attr = {}) {
    let attrsToUseCount = 0;
    Object.entries(attr).forEach(([key, value]) => {
      if (value === undefined) return;
      if (typeof value !== "string") query.where(key, value);
      else
        query.where(raw(`trim(lower(??))`, [`${this.Model.tableName}.${key.trim()}`]), value.toLowerCase());
      attrsToUseCount++;
    });
    if (attrsToUseCount === 0) throw new ApplicationException("DB cannot be queried, no attribute passed");
    return query;
  }
}

const capitalize = (word) => {
  if (typeof word !== "string") throw Error(`Capitalize --> ${word} not a string`);
  let start = word[0].toUpperCase();
  return start + word.substr(1);
};

module.exports = BaseRepo;
