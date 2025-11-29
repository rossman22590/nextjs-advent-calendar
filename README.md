# Next.js Advent Calendar

This is a small advent calendar web app that allows to create and populate 24 windows with digital content to make friends, family and strangers happy during advent.


<img src="demo/overview.png" alt="Days overview" width="350" />
<img src="demo/content.png" alt="YouTube content window" width="350" />


## Features

- multiple advent calendars
- various content types: image, link, YouTube embed, Spotify embed, video embed, quiz
- (hacky) editor to populate the calendars with content
- Postgres-backed storage (no Firebase required)


## Technologies Used

- [Next.js 13](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- Postgres (`pg`)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)


### Install dependencies

```bash
npm install
```

Set `DATABASE_URL` in your environment to point at your Postgres instance.

### Database schema

Run the migrations (requires `DATABASE_URL`):

```bash
npm run migrate
```

The migration files live in `migrations/` if you want to inspect or tweak them.

Push notifications are left as a stub in `/components/NotificationManager.tsx` and `/app/api/cron/route.ts`; hook these up to your own push provider if you need them.

### Run the development server

```bash
npm run dev
```

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
