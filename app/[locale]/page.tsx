import { redirect } from 'next/navigation';

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  redirect(`/${locale}/dashboard`);
};

export default HomePage;
