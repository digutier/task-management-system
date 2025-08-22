// API Service for handling all HTTP requests
export class ApiService {
  static async get(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    return await response.json();
  }

  static async post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to post to ${url}`);
    }
    return await response.json();
  }

  static async patch(url, data = null, params = null) {
    const fullUrl = params ? `${url}?${params.toString()}` : url;
    const options = {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      }
    };

    if (data) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }

    const response = await fetch(fullUrl, options);
    
    if (!response.ok) {
      throw new Error(`Failed to patch ${fullUrl}`);
    }
    return await response.json();
  }
}
