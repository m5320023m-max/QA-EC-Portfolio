const http = require("node:http");
const products = require("./productlist.js");

const server = http.createServer((req, res) => {

    // 商品一覧を取得する
    if (req.method === "GET" && req.url === "/api/products") {
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });

        res.end(JSON.stringify(products));
        return;
    }

    // 商品IDを指定して1件取得する（既存処理）
    if (req.method === "GET" && req.url.startsWith("/api/products/")) {

        // URLから商品IDを取り出す
        const productId = req.url.split("/")[3];

        // 商品IDから商品情報を取得する
        const product = products[productId];

        // GETで商品が見つからなかった場合
        if (!product) {
            res.writeHead(404);
            res.end("Not Found");
            return;
        }

        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });

        res.end(JSON.stringify(product));
        return;
    }

    // POSTリクエストを受け取る
    if (req.method === "POST" && req.url === "/api/calculate") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const data = JSON.parse(body);

            const product = products[data.productId];

            // POSTで商品が見つからなかった場合
            if (!product) {
                res.writeHead(404);
                res.end("Not Found");
                return;
            }

            const total = product.price * data.quantity;

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                productId: data.productId,
                quantity: data.quantity,
                unitPrice: product.price,
                total: total
            }));
        });

        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(3000, () => {
    console.log("API server started");
});