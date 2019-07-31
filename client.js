const publicVapidKey = 'BL5-PPARGlQpLR7ZGwtnlgz00Yu7A16SxSJ8MuDdKcX42OgxkGsVkvLqMfv9AMiuhEka0EihoyRrgb9E81Ej6E8';

if ('serviceWorker' in navigator) {
  // Service Worker không được hỗ trợ, vô hiệu hóa hoặc ẩn UI đi. 
  console.log('Registering service worker');

  run().catch(error => console.log(error));
}

// if (!('PushManager' in window)) { 
//   // Push không được hỗ trợ, vô hiệu hóa hoặc ẩn UI đi. 
//   return; 
// }

async function run() {
  console.log('Registering service worker');
  const registration = await navigator.serviceWorker.
    register('/worker.js', {scope: '/'});
  console.log('Registered service worker123123123', registration);

  console.log('Registering push');
  const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
  console.log('Registered push 123123 ', subscription);

  console.log('Sending push');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Sent push');
}

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
