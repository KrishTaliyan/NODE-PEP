const root = document.getElementById('app');

const routes = {
  '/': renderHome,
  '/about': renderAbout,
  '/posts': renderPosts,
  '/contact': renderContact,
};

// Link delegation for client-side navigation
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-link]');
  if (!a) return;
  e.preventDefault();
  const href = a.getAttribute('href');
  navigate(href);
});

window.addEventListener('popstate', render);

function navigate(path){
  history.pushState({}, '', path);
  render();
}

function render(){
  const path = location.pathname;
  const renderer = routes[path] || renderNotFound;
  renderer();
}

function renderHome(){
  root.innerHTML = `
    <h2>Welcome</h2>
    <p class="muted">This page is rendered entirely on the client using JavaScript.</p>
    <p>Use the navigation links to change views without a full page reload.</p>
  `;
}

function renderAbout(){
  root.innerHTML = `
    <h2>About</h2>
    <p class="muted">Small demo of client-side rendering (CSR).</p>
    <p>This SPA uses history API routing and DOM updates.</p>
  `;
}

async function renderPosts(){
  root.innerHTML = `<h2>Posts</h2><p class="muted">Loading posts...</p>`;
  try{
    // Example fetch to a public placeholder API; CORS permitting.
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
    const posts = await res.json();
    root.innerHTML = '<h2>Posts</h2>' + posts.map(p => `
      <article class="post">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.body)}</p>
      </article>
    `).join('');
  }catch(err){
    root.innerHTML = `<h2>Posts</h2><p class="muted">Failed to load posts: ${err.message}</p>`;
  }
}

function renderContact(){
  root.innerHTML = `
    <h2>Contact</h2>
    <form id="contact">
      <label>Name<br><input name="name" required></label><br><br>
      <label>Message<br><textarea name="message" required></textarea></label><br><br>
      <button type="submit">Send</button>
    </form>
    <div id="result"></div>
  `;

  document.getElementById('contact').addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const out = Object.fromEntries(fd.entries());
    document.getElementById('result').innerHTML = `<pre>${escapeHtml(JSON.stringify(out, null, 2))}</pre>`;
  });
}

function renderNotFound(){
  root.innerHTML = `
    <h2>404</h2>
    <p class="muted">Page not found.</p>
  `;
}

function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// initial render
render();
