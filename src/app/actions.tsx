'use server';

import AuthConstant from '@/libs/constants/authConstant';
import { getSession } from 'next-auth/react';
import { cookies } from 'next/headers';

export async function initCookie() {
  'use server';
  const cookieStore = cookies();
  if (!cookieStore.has(AuthConstant.AccessTokenCookieName)) {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);

    const session = await getSession();
    if (session && session['accessToken']) {
      cookieStore.set(AuthConstant.AccessTokenCookieName, session['accessToken'], {
        expires: expiredDate,
      });
    } else {
      cookieStore.set(AuthConstant.AccessTokenCookieName, 'fake_token', {
        expires: expiredDate,
      });
    }
  }
}
