import Company from "#/models/company-core/companies.model.js";

const findById = (id) => {
  return Company.findById(id).lean();
};

const findMany = (limit, skip) => {
  return Company.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const countAll = () => {
  return Company.countDocuments();
};

const findByCompanyCode = (companyCode) => {
  return Company.findOne({ companyCode }).lean();
};

const create = (data) => {
  return Company.create(data);
};

const updateById = (id, update) => {
  return Company.findOneAndUpdate(
    { _id: id },
    update,
    {
      returnDocument: "after",
      runValidators: true,
      lean: true
    }
  );
};

const deleteById = (id) => {
  return Company.deleteOne({ _id: id });
};

export const companiesRepo = {
  findById,
  findMany,
  countAll,
  findByCompanyCode,
  create,
  updateById,
  deleteById
};
