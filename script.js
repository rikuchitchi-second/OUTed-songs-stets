// 1. 統計データの定義 (年 -> 月 -> 週 -> データの配列)
// 本来は外部のデータベースやJSONファイルから取得しますが、まずはこの中で管理・拡張可能です。
const chartData = {
    "2026": {
        "5": {
            "3": [
                { name: "VTuberサンプルA", viewsGrowth: 250000 },
                { name: "VTuberサンプルB", viewsGrowth: 480000 },
                { name: "VTuberサンプルC", viewsGrowth: 120000 },
                { name: "VTuberサンプルD", viewsGrowth: 85000 }
            ],
            "4": [
                { name: "VTuberサンプルA", viewsGrowth: 190000 },
                { name: "VTuberサンプルB", viewsGrowth: 310000 }
            ]
        }
    },
    "2025": {
        "12": {
            "1": [
                { name: "VTuberサンプルC", viewsGrowth: 500000 }
            ]
        }
    }
};

// 2. ボタンのクリックイベントなどを登録
document.getElementById('search-btn').addEventListener('click', updateChart);

// 3. チャートを更新するメインロジック
function updateChart() {
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

    // 安全にデータを探索（データが存在しない場合のハンドリング）
    const yearly = chartData[year];
    const monthly = yearly ? yearly[month] : null;
    const weeklyData = monthly ? monthly[week] : null;

    // データが存在しない場合
    if (!weeklyData || weeklyData.length === 0) {
        table.classList.add('hidden');
        noDataText.classList.remove('hidden');
        return;
    }

    // データが存在する場合の表示切り替え
    table.classList.remove('hidden');
    noDataText.classList.add('hidden');

    // 【重要】再生回数の増加数（viewsGrowth）が大きい順にソート（並び替え）
    const sortedData = [...weeklyData].sort((a, b) => b.viewsGrowth - a.viewsGrowth);

    // ソートされたデータを一行ずつHTMLテーブルに組み立てて挿入
    sortedData.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // 1列目: 順位 (配列のインデックスは0から始まるので +1 する)
        const rankCell = document.createElement('td');
        rankCell.innerHTML = `<strong>${index + 1}位</strong>`;
        row.appendChild(rankCell);

        // 2列目: 名前
        const nameCell = document.createElement('td');
        nameCell.innerText = item.name;
        row.appendChild(nameCell);

        // 3列目: 増加数（3桁ずつのカンマ区切りに整形 `toLocaleString()`）
        const growthCell = document.createElement('td');
        growthCell.innerText = `+${item.viewsGrowth.toLocaleString()}`;
        growthCell.style.color = '#e74c3c'; // 数字を強調する赤系
        growthCell.style.fontWeight = 'bold';
        row.appendChild(growthCell);

        // テーブルの本体（tbody）に追加
        tbody.appendChild(row);
    });
}

// 4. ページを開いた瞬間に、初期状態で選択されている期間のデータを一度表示する
window.onload = updateChart;
