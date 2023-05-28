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
];
