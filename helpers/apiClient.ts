import { Page } from '@playwright/test';

export class ApiClient {
  constructor(private page: Page) {}

  async get(url: string) {
    const res = await this.page.evaluate(async url => {
      const r = await fetch(url);
      return { status: r.status, body: await r.json() };
    }, url);
    return res;
  }

  async post(url: string, data: any) {
    const res = await this.page.evaluate(async ({ url, data }) => {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return { status: r.status, body: await r.json() };
    }, { url, data });
    return res;
  }

  async put(url: string, data: any) {
    const res = await this.page.evaluate(async ({ url, data }) => {
      const r = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return { status: r.status, body: await r.json() };
    }, { url, data });
    return res;
  }

  async patch(url: string, data: any) {
    const res = await this.page.evaluate(async ({ url, data }) => {
      const r = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return { status: r.status, body: await r.json() };
    }, { url, data });
    return res;
  }

  async delete(url: string) {
    const res = await this.page.evaluate(async url => {
      const r = await fetch(url, { method: 'DELETE' });
      return { status: r.status };
    }, url);
    return res;
  }
}
