import model from "#models/token.model";

function createTokenFunctions() {
  async function get(key) {
    try {
      const stringifiedJson = await model.getToken(key);
      return JSON.parse(stringifiedJson.value);
    } catch {
      return null;
    }
  }

  async function del(key) {
    const deleteToken = await model.deleteToken(key);
    return deleteToken;
  }

  return {
    get,
    del,
  };
}

export default createTokenFunctions;
