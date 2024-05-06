import requests
import json

url = "https://api.fabric.microsoft.com/v1/workspaces/<workspace-id>/items"

payload = json.dumps({
  "displayName": "pipeline_test",
  "type": "DataPipeline",
  "definition": {
    "parts": [
      {
        "path": "pipeline-content.json",
        "payload": "<base64 encoded json properties of the pipeline>",
        "payloadType": "InlineBase64"
      }
    ]
  }
})
headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <bearer-token-value>'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
