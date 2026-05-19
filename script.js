// 1. 【重要】ここにステップ2でコピーしたGoogleスプレッドシートのCSVのURLを貼り付けます
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/XXXXXX/pub?output=csv";

// ボタンのクリックイベントを登録
document.getElementById('search-btn').addEventListener('click', updateChart);

// チャートを更新するメインロジック（非同期処理 async を追加）
async function updateChart() {
    // 画面の選択値を取得
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const week = document.getElementById('week').value;

    // タイトル文字の書き換え
    document.getElementById('chart-title').innerText = `${year}年${month}月 第${week}週の増加数ランキング`;

    const tbody = document.getElementById('chart-body');
    const noDataText = document.getElementById('no-data');
    const table = document.getElementById('chart-table');

    // 表示されている古いテーブルの中身をクリア
    tbody.innerHTML = '';

    try {
        // ① インターネット経由でスプレッドシートのCSVデータを取得
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error("データの取得に失敗しました");
        const csvText = await response.text();

        // ② CSVテキストを1行ずつに分解して、扱いやすいオブジェクトの配列に変換
        const lines = csvText.split('\n');
        const allData = [];

        // 1行目はヘッダー（項目名）なので、2行目（インデックス1）から処理する
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // 空行はスキップ
            
            const columns = line.split(',');
            // スプレッドシートの列の順番通りにデータを格納
            allData.push({
                year: columns[0].trim(),
                month: columns[1].trim(),
                week: columns[2].trim(),
                name: columns[3].trim(),
                viewsGrowth: parseInt(columns[4].trim(), 10) || 0
            });
        }

        // ③ ユーザーが画面で選択した「年・月・週」に完全に一致するデータだけを抽出（フィルター）
        const filteredData = allData.filter(item => 
            item.year === year && 
            item.month === month && 
            item.week === week
        );

        // 該当データが存在しない場合
        if (filteredData.length === 0) {
            table.classList.add('hidden');
            noDataText.classList.remove('hidden');
            return;
        }

        // データが存在する場合の表示切り替え
        table.classList.remove('hidden');
        noDataText.classList.add('hidden');

        // ④ 抽出されたデータを、再生回数（viewsGrowth）が大きい順にソート（並び替え）
        const sortedData = filteredData.sort((a, b) => b.viewsGrowth - a.viewsGrowth);

        // ⑤ ソートされたデータをHTMLテーブルに挿入
        sortedData.forEach((item, index) => {
            const row = document.createElement('tr');
            
            // 1列目: 順位
            const rankCell = document.createElement('td');
            rankCell.innerHTML = `<strong>${index + 1}位</strong>`;
            row.appendChild(rankCell);

            // 2列目: 名前
            const nameCell = document.createElement('td');
            nameCell.innerText = item.name;
            row.appendChild(nameCell);

            // 3列目: 増加数（カンマ区切り）
            const growthCell = document.createElement('td');
            growthCell.innerText = `+${item.viewsGrowth.toLocaleString()}`;
            growthCell.style.color = '#e74c3c';
            growthCell.style.fontWeight = 'bold';
            row.appendChild(growthCell);

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("エラーが発生しました:", error);
        table.classList.add('hidden');
        noDataText.innerText = "データの読み込み中にエラーが発生しました。URLの設定等を確認してください。";
        noDataText.classList.remove('hidden');
    }
}

// ページを開いた瞬間に一度実行する
window.onload = updateChart;
