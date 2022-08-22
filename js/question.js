let url;

const select = (ele) => document.querySelector(ele);

const getQues = async (amount, catg) => {
  url = `https://opentdb.com/api.php?amount=${amount}&category=${catg}&difficulty=medium&type=multiple`;
  let req = await fetch(url);
  let { results } = await req.json();
  return await results;
};

export { url, getQues, select };
