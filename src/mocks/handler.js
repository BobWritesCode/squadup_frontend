import { rest } from 'msw';

// const baseURL= 'https://squadup-api.herokuapp.com/'
const baseURL = 'http://127.0.0.1:8000/';

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

  rest.get(`${baseURL}profiles/28`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 28,
        owner: 'JimmyBob',
        tracker: '',
        image:
          'https://res.cloudinary.com/dxjilemam/image/upload/v1/squadup/avatars/download_1_tkm6at',
        created_at: '2023-05-25T15:36:12.910596Z',
        is_owner: false,
        email: 'test@test.me',
      }),
    );
  }),

  rest.post(`${baseURL}dj-rest-auth/token/refresh/`, (req, res, ctx) => {
    return res(ctx.json({ status: 200 }));
  }),

  rest.get(`${baseURL}posts/`, (req, res, ctx) => {
    const queryParams = req.url.searchParams;
    const owner = queryParams.get('owner');

    if (owner === 9) {
      return res(ctx.status(404));
    }

    return res(
      ctx.json({
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 355,
            owner: 'WozzaWozzaWozza',
            is_owner: true,
            profile_id: 9,
            created_at: '2023-05-25T13:48:21.644639Z',
            updated_at: '2023-05-25T13:48:21.644656Z',
            content: 'WE CAN DO IT!',
            image:
              'https://res.cloudinary.com/dxjilemam/image/upload/v1/squadup/post_images/frspo3znfu0wjst0i6h9',
          },
          {
            id: 354,
            owner: 'WozzaWozzaWozza',
            is_owner: true,
            profile_id: 9,
            created_at: '2023-05-25T13:12:20.097046Z',
            updated_at: '2023-05-25T13:12:20.097061Z',
            content: 'I think I will hit diamond soon!',
            image:
              'https://res.cloudinary.com/dxjilemam/image/upload/v1/squadup/post_images/tqtnoag4rgewxdbjkexs',
          },
        ],
      }),
    );
  }),

  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.get(`${baseURL}lfg/`, (req, res, ctx) => {
    const queryParams = req.url.searchParams;
    const status = queryParams.get('status');

    if (status !== 'true') {
      return res(ctx.status(404));
    }

    return res(
      ctx.json({
        count: 6,
        next: null,
        previous: null,
        results: [
          {
            id: 244,
            owner: 'JimmyBob',
            owner_id: 28,
            game_type: 'Competitive',
            max_team_size: 4,
            current_team_size: 3,
            lowest_rank: 0,
            highest_rank: 9,
            content: '',
            is_owner: false,
            status: true,
            roles: ['Any'],
          },
          {
            id: 239,
            owner: 'WozzaWozzaWozza',
            owner_id: 9,
            game_type: 'Tournament',
            max_team_size: 5,
            current_team_size: 2,
            lowest_rank: 7,
            highest_rank: 7,
            content:
              'We are a small team trying to rank up. We play weekly on Monday nights. Just chill and good vibes. If you think you might be a fit for our little crew, put in a request and we shall see. GLHF!',
            is_owner: true,
            status: true,
            roles: ['Sentinel', 'Any', 'Duelist'],
          },
          {
            id: 238,
            owner: 'Jerry',
            owner_id: 16,
            game_type: 'Casual',
            max_team_size: 5,
            current_team_size: 3,
            lowest_rank: 3,
            highest_rank: 5,
            content: 'Just for the chills! We need 2!',
            is_owner: false,
            status: true,
            roles: ['Any', 'Any'],
          },
          {
            id: 237,
            owner: 'John',
            owner_id: 15,
            game_type: 'Tournament',
            max_team_size: 3,
            current_team_size: 1,
            lowest_rank: 3,
            highest_rank: 5,
            content: '',
            is_owner: false,
            status: true,
            roles: ['Controller', 'Duelist'],
          },
          {
            id: 225,
            owner: 'Bobby',
            owner_id: 12,
            game_type: 'Competitive',
            max_team_size: 2,
            current_team_size: 1,
            lowest_rank: 1,
            highest_rank: 1,
            content: '',
            is_owner: false,
            status: true,
            roles: ['Any'],
          },
          {
            id: 222,
            owner: 'Player',
            owner_id: 11,
            game_type: '2',
            max_team_size: 3,
            current_team_size: 2,
            lowest_rank: 2,
            highest_rank: 3,
            content: 'Join us, we will rule the world!',
            is_owner: false,
            status: true,
            roles: ['Any'],
          },
        ],
      }),
    );
  }),

  rest.get(`${baseURL}lfg_slots_apply/`, (req, res, ctx) => {
    const queryParams = req.url.searchParams;
    const slot = queryParams.get('slot');
    const status = queryParams.get('status');

    if (status !== 'Accepted' && slot === 228) {
      return res(ctx.status(404));
    }
    console.log('found');
    return res(
      ctx.json({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 135,
            slot: 228,
            role: 'Any',
            rank: '0',
            content: '',
            reply_content: 'You are in!',
            created_at: '3 hours ago',
            owner: 'WozzaWozzaWozza',
            ownerID: 9,
            is_owner: true,
            status: 'Accepted',
          },
        ],
      }),
    );
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

  rest.get(`${baseURL}lfg_slots/`, (req, res, ctx) => {
    const queryParams = req.url.searchParams;
    const lfg = queryParams.get('lfg');

    if (lfg !== '239') {
      return res(ctx.status(404));
    }

    return res(
      ctx.json({
        count: 3,
        next: null,
        previous: null,
        results: [
          {
            id: 221,
            lfg: 239,
            role: 'Sentinel',
            status: 'Open',
            content:
              'We need someone who can watch our flank. My friend is always saying we need utility behind us.',
            created_at: '3 days, 23 hours ago',
            owner: 'WozzaWozzaWozza',
            is_owner: true,
          },
          {
            id: 220,
            lfg: 239,
            role: 'Any',
            status: 'Closed',
            content:
              'We are not really worried what agent you like to play here.',
            created_at: '3 days, 23 hours ago',
            owner: 'WozzaWozzaWozza',
            is_owner: true,
          },
          {
            id: 219,
            lfg: 239,
            role: 'Duelist',
            status: 'Closed',
            content:
              'Ideally someone who can main Raze or Jett. Our team will offer some really good support for entry.',
            created_at: '3 days, 23 hours ago',
            owner: 'WozzaWozzaWozza',
            is_owner: true,
          },
        ],
      }),
    );
  }),
];
