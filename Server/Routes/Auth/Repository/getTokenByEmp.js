const supabase = require("../../../db");

const getTokenByEmp = async (empCode) => {
  const { data, error } = await supabase
    .from("token_tbls")
    .select("*")
    .eq("emp_code", empCode);

  if (error) throw new Error(error.message);
  return data; // array of tokens
};

module.exports = { getTokenByEmp };