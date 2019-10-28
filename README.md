Image Diff API
========================================

Getting Started
----------------------------------------
```bash
npm install
npm start

# { "percent": 0.xxx, "image": "(Base64 Image)" }
curl --silent \
  -X POST -d "$(echo " {
    \"mode\": \"strict\",
    \"actual\": \"http://via.placeholder.com/350x150?text=AAA\",
    \"expect\": \"http://via.placeholder.com/350x150?text=BBBB\"
  } " | tr -d '\n ')" \
  http://localhost:3000/image/diff \
| jq -r .image \
| base64 -D > diff.png

```

Deploy to AWS
----------------------------------------
```bash
export AWS_ACCESS_KEY_ID="(Admin Access)"
export AWS_SECRET_ACCESS_KEY="(Admin Access)"

npm install
npm run deploy
```

Destroy from AWS
----------------------------------------
```bash
export AWS_ACCESS_KEY_ID="(Admin Access)"
export AWS_SECRET_ACCESS_KEY="(Admin Access)"

npm install
npm run destroy
```
