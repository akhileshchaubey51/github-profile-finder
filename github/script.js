// mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('show');
});

// GitHub fetch logic
const input = document.getElementById('username');
const btn = document.getElementById('searchBtn');
const statusEl = document.getElementById('status');
const profileEl = document.getElementById('profile');

btn.addEventListener('click', () => searchUser());
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchUser(); });

async function searchUser() {
    const username = (input.value || '').trim();
    profileEl.hidden = true;
    profileEl.innerHTML = '';
    statusEl.textContent = '';

    if (!username) {
        statusEl.textContent = 'Please enter a username.';
        return;
    }

    statusEl.textContent = 'Fetching profile…';

    try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
        const data = await res.json();

        if (!res.ok || data.message === 'Not Found') {
            throw new Error('User not found');
        }

        statusEl.textContent = '';

        profileEl.innerHTML = `
      <div class="top">
        <div class="profile-head">
          <img class="avatar" src="${data.avatar_url}" alt="${data.login} avatar">
          <div>
            <h3 style="margin:0">${data.name || data.login}</h3>
            <a href="${data.html_url}" target="_blank" rel="noopener">View on GitHub →</a>
          </div>
        </div>
        <div class="meta">
          <span>Repos: ${data.public_repos}</span>
          <span>Followers: ${data.followers}</span>
          <span>Following: ${data.following}</span>
          ${data.location ? `<span>📍 ${data.location}</span>` : ''}
        </div>
      </div>

      ${data.bio ? `<p class="bio">${escapeHtml(data.bio)}</p>` : ''}
    `;
        profileEl.hidden = false;

    } catch (err) {
        statusEl.textContent = `❌ ${err.message}`;
    }
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
