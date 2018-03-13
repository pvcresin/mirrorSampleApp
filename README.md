# Mirror Sample App

インタラクション2018で発表した **「(3A09★) タッチパネルを拡張する紙製インタフェースを搭載したインタラクティブパッケージの開発」** の鏡台アプリのソースです．
サーバを起動することで，Webアプリが使用可能になります．

動作している動画は [こちら](https://youtu.be/kHVGmV3sYIg)

[![https://gyazo.com/063e8bc40429112cc0ae21d788a228a6](https://i.gyazo.com/063e8bc40429112cc0ae21d788a228a6.png)](https://gyazo.com/063e8bc40429112cc0ae21d788a228a6)

## 準備

- PC1台（サーバ）
	- [Node.js](https://nodejs.org/ja/) の v8 以上を入れておく
	- npm の v5 以上
		- Node.jsのインストール時に一緒に入れる

- スマートフォン1台（クライアント）
	- 最新版のGoogle Chromeを入れておく
	- Galaxy S6 edgeを推奨（その他の機種でのレイアウトは未考慮）

※ テスト環境

- Windows 10 (64bit)
	- Node.js (v8.8.0)
	- npm (v5.4.2)
- Galaxy S6 edge

# 使う

1. PCとスマートフォンを同じWi-Fiに接続

1. PCでの作業
	- 基本的にコマンドプロンプト もしくは ターミナルから，コマンドを実行します．プロジェクトのルートに移動して作業します．

		1. ソースをダウンロード

			https://github.com/pvcresin/mirrorSampleApp
		1. PCの ローカルIPアドレス を調べておく
		1. 動作に必要なライブラリのインストール
			- `npm install`

		1. サーバを起動
			- `npm run start`
				- 3000番のポートでサーバが起動する

1. スマートフォンでの作業
	1. Chromeで先程調べたローカルIPアドレスを元にPCのサーバにアクセスする
		- 例）`https://192.168.xx.xx:3000`
	1. 「この接続ではプライバシー保護がされません」などの警告が出る場合があるが，「詳細設定」を押して接続する
	1. カメラの使用を許可する

1. 使用する
	- 機能は動作している動画を参照
	- 録画した場合，サーバPCの `videos/` フォルダに追加される

※ Wi-Fiによっては稀に，サーバが起動していてもスマートフォンからアクセスできない場合があります．その場合，他のWi-Fiを試して見ることをおすすめします．

# 開発する

1. 動作に必要なライブラリのインストール
	- `npm install`

1. ソースファイル（`src/`）をコンパイル
	- `npm run watch`

1. ソースファイルを編集すると，自動的にコンパイルされます
	- サーバ
		- `src/server.js` -> `dist/server.js`
	- クライアント
		- `src/*` -> `public/*`

## 開発に必要な知識

- HTML
	- Pug
- CSS
	- PostCSS
- JavaScript
	- Riot.js
- Node.js
	- Express

## 実装の説明

クライアントでの鏡と録画のためにWebRTC技術を使っています．

そのため，SSL通信が必要となり，適当に作った証明書（`src/test.pfx`）を使ってサーバを起動しています．
