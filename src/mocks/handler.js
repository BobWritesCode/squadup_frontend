import { rest } from 'msw';

const baseURL= 'https://squadup-api.herokuapp.com/'

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 9,
        username: 'WozzaWozzaWozza',
        email: 'contact@warwickhart.com',
        first_name: '',
        last_name: '',
        profile_id: 9,
        profile_image:
          'https://res.cloudinary.com/dxjilemam/image/upload/v1/squadup/avatars/zsbkg3dkvgybxuh6wrgh',
      }),
    );
  }),

  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.get(`${baseURL}lfg_slots_apply/88/`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 88,
        slot: 198,
        role: 'Duelist',
        rank: '3',
        content: 'Can I play please?',
        reply_content: '',
        created_at: '1 week ago',
        owner: 'User',
        ownerID: 10,
        is_owner: false,
        status: 'Awaiting',
      }),
    );
  }),
];
