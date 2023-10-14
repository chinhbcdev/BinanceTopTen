import React, { useState, useEffect } from "react";

function BinanceTopTen() {
  const [topTen, setTopTen] = useState([]);

  useEffect(() => {
    const windowSize = "1h";
    const allTickers = {};

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/!ticker_${windowSize}@arr`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Cập nhật dữ liệu trong allTickers
      for (const ticker of data) {
        allTickers[ticker.s] = ticker;
      }

      // Chuyển đổi object thành mảng và sắp xếp
      const sortedData = Object.values(allTickers).sort(
        (a, b) => parseFloat(b.P) - parseFloat(a.P)
      );

      // Lấy top 10 với điều kiện Price Change Percent > 2
      const updatedTopTen = sortedData
        .slice(0, 10)
        .filter((ticker) => parseFloat(ticker.P) > 2);

      setTopTen(updatedTopTen);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket Error: ${error}`);
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log(
          `Closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.error("Connection died");
      }
    };

    // Clean-up function
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      {topTen.map((ticker) => (
        <div key={ticker.s}>
          <p>
            <strong>Symbol:</strong> {ticker.s}
          </p>
          <p>
            <strong>Price Change:</strong> {ticker.p}
          </p>
          <p>
            <strong>Price Change Percent:</strong> {ticker.P}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default BinanceTopTen;
