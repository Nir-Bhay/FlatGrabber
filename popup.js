document.getElementById('launch-btn').addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: 'https://www.flaticon.com' });
    } else {
        window.open('https://www.flaticon.com', '_blank');
    }
});
