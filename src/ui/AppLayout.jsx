import { Outlet } from 'react-router';
import Header from './Header';
import Sidebar from './Sidebar';
import Main from './Main';

export default function AppLayout() {
  return (
    <>
      <Sidebar />
      <Header />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
