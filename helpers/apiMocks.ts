import { Page } from '@playwright/test';

type MockOptions = {
  status?: number;
  body?: any;
};

export async function mockUsers(
  page: Page,
  options?: { status?: number; body?: any }
) {
  // Route for GET/POST /users and /users/:id
  await page.route('**/api/users', async route => {
    const request = route.request();
    const method = request.method();
    const payload = request.postDataJSON?.();

    if (method === 'GET') {
      return route.fulfill({
        status: options?.status ?? 200,
        contentType: 'application/json',
        body: JSON.stringify(
          options?.body ?? {
            data: [{ id: 1 }, { id: 2 }]
          }
        )
      });
    }

    if (method === 'POST') {
      return route.fulfill({
        status: options?.status ?? 201,
        contentType: 'application/json',
        body: JSON.stringify(
          options?.body ?? {
            ...payload,
            id: 1,
            createdAt: new Date().toISOString()
          }
        )
      });
    }

    route.continue();
  });

  // Route for GET/PUT/PATCH /users/:id
  await page.route('**/api/users/*', async route => {
    const request = route.request();
    const method = request.method();
    const payload = request.postDataJSON?.();

    if (method === 'GET') {
      return route.fulfill({
        status: options?.status ?? 200,
        contentType: 'application/json',
        body: JSON.stringify(
          options?.body ?? {
            data: { id: 2 }
          }
        )
      });
    }

    if (method === 'PUT' || method === 'PATCH') {
      return route.fulfill({
        status: options?.status ?? 200,
        contentType: 'application/json',
        body: JSON.stringify(
          options?.body ?? {
            ...payload,
            updatedAt: new Date().toISOString()
          }
        )
      });
    }

    return route.continue();
  });
}


export async function mockUpdateUser(page: Page, options?: MockOptions) {
  await page.route('**/api/users/*', async route => {
    const method = route.request().method();
    const payload = route.request().postDataJSON?.();

    if (method === 'PUT' || method === 'PATCH') {
      return route.fulfill({
        status: options?.status ?? 200,
        contentType: 'application/json',
        body: JSON.stringify(
          options?.body ?? {
            ...payload,
            updatedAt: new Date().toISOString()
          }
        )
      });
    }

    return route.continue();
  });
}

export async function mockDeleteUser(page: Page, options?: MockOptions) {
  await page.route('**/api/users/*', async route => {
    if (route.request().method() === 'DELETE') {
      return route.fulfill({
        status: options?.status ?? 204
      });
    }

    return route.continue();
  });
}

export async function mockUnknown(page: Page, options?: MockOptions) {
  await page.route('**/api/unknown/*', async route => {
    return route.fulfill({
      status: options?.status ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(
        options?.body ?? {
          data: { id: 2 }
        }
      )
    });
  });
}

export async function mockRegister(page: Page, options?: MockOptions) {
  await page.route('**/api/register', async route => {
    return route.fulfill({
      status: options?.status ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(
        options?.body ?? {
          id: 4,
          token: 'fake-token'
        }
      )
    });
  });
}
