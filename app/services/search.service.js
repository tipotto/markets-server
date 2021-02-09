const Key = require('../constants/search');
const { PythonShell } = require('python-shell');

module.exports = class SearchService {
  static init() {
    return new SearchService();
  }

  sortInAscOrder(data) {
    return data.sort((a, b) => (a.price < b.price ? -1 : 1));
  }

  sortInDescOrder(data) {
    return data.sort((a, b) => (a.price > b.price ? -1 : 1));
  }

  sortArray(data, sortOrder) {
    console.log('3. 検索結果をソート。');
    if (sortOrder === 'asc') {
      return this.sortInAscOrder(data);
    }
    return this.sortInDescOrder(data);
  }

  // integrateArray(resultArr) {
  //   console.log('3. 検索結果の配列をマージ。');

  //   let results = [];
  //   resultArr.forEach((arr) => {
  //     results = [...results, ...arr];
  //   });
  //   return results;
  // }

  scrape(form) {
    return new Promise((resolve, reject) => {
      console.log('1. python-shellの呼び出し。');
      const pyShell = new PythonShell(Key.PYTHON_PATH, {
        mode: 'text',
      });

      const data = {
        category: form.category,
        query: form.query,
        platforms: form.platforms,
        minPrice: form.minPrice,
        maxPrice: form.maxPrice,
        productStatus: form.productStatus,
        salesStatus: form.salesStatus,
        deliveryCost: form.deliveryCost,
        sortOrder: form.sortOrder,
      };

      console.log('2. フォームデータをpython側に送信。');
      pyShell.send(JSON.stringify(data));

      pyShell.on('message', async (data) => {
        const results = JSON.parse(data || 'null');
        // Scrapyの場合
        // resultsには配列が返ってくる
        // const sorted = this.sortArray(results, form.sortOrder);

        // Asyncioの場合
        // resultsには多次元配列が返ってくる
        // そのため、1つの配列にまとめる必要あり
        // const integrated = this.integrateArray(results);
        // const sorted = this.sortArray(integrated, form.sortOrder);
        const sorted = this.sortArray(results, form.sortOrder);
        resolve(sorted);
      });

      pyShell.end((err) => {
        if (err) reject(err);
        console.log('4. 一通り処理を終了。');
      });
    });
  }

  async search(form) {
    return this.scrape(form);
  }
};
