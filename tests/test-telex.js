const url = "https://ping.telex.im/v1/webhooks/01951ee4-d5b1-7232-9322-d47d05bbacea";
const data = {
  "event_name": "Test Alert",
  "message": "This is a test alert from JavaScript.",
  "status": "success",
  "username": "EstherBot"
};

fetch(url, {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(console.log)
.catch(console.error);
