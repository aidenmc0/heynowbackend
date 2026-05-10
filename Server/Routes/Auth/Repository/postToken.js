const supabase = require("../../../db");

const postToken = async ({ token_code, emp_code, token, expired, createdBy }) => {
  const { error } = await supabase
    .from("token_tbls")
    .insert({
      token_code,
      emp_code,
      token,
      expired,
      createdby: createdBy,
    });

  if (error) throw new Error(error.message);
  return 1; // success
};

module.exports = { postToken };