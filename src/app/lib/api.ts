const API_URL = 'http://localhost:1337';

export async function signUp(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  return res.json();
}

export async function login(identifier: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/local`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });
  return res.json();
}

export async function getArticles() {
  const res = await fetch(`${API_URL}/api/articles?populate=*`, {
    cache: 'no-store'
  });
  return res.json();
}

export async function getArticle(slug: string) {
  const res = await fetch(`${API_URL}/api/articles?filters[slug][$eq]=${slug}`, {
    cache: 'no-store'
  });
  return res.json();
}

export async function createArticle(data: any, token: string) {
  const res = await fetch(`${API_URL}/api/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });
  return res.json();
}
