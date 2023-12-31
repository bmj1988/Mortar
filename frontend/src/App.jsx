import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { thunkRestoreUser } from './store/session';
import { useDispatch } from 'react-redux';
import NavBar from './components/Navigation/Navigation'
import Main from './components/Main/Main.jsx'
import ManageSpots from './components/ManageSpotsModal/ManageSpots.jsx';
import UserReviews from './components/UserReviews/UserReviews.jsx';
import SpotPage from './components/SpotPage/SpotPage.jsx';
import SpotFormPage from './components/SpotFormPage/SpotFormPage.jsx';
import SpotUpdatePage from './components/SpotFormPage/SpotUpdatePate.jsx';
import SearchPage from './components/SearchPage/SearchPage.jsx';
import BookingPage from './components/BookingPage/BookingPage.jsx';
import ManageBookings from './components/ManageBookings/ManageBookings.jsx';
import EditBookingPage from './components/BookingPage/EditBookingPage.jsx';


const Layout = () => {
  const dispatch = useDispatch();
  const [userFetched, setUserFetched] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      await dispatch(thunkRestoreUser());
      setUserFetched(true)
    }
    getUser()
  }, [dispatch])

  return (
    <>
      <NavBar userFetched={userFetched} />
      <main>
        {userFetched && <Outlet />}
      </main>
    </>
  )
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Main />
      },
      {
        path: '/current',
        element: <ManageSpots />
      },
      {
        path: '/reviews',
        element: <UserReviews />
      },
      {
        path: '/spots',
        children: [
          {
            path: ':id',
            element: <SpotPage />
          }
        ]
      },
      {
        path: '/createSpot',
        element: <SpotFormPage />
      },
      {
        path: '/updateSpot',
        children: [
          {
            path: ':id',
            element: <SpotUpdatePage />
          }
        ]
      },
      {
        path: '/search',
        element: <SearchPage />
      },
      {
        path: '/book',
        children: [
          {
            path: ':spotId',
            element: <BookingPage />
          }
        ]
      },
      {
        path: '/bookings',
        element: <ManageBookings/>,
      },
      {
        path: 'editBooking',
        children: [
          {
            path: ':bookingId',
            element: <EditBookingPage />
          }
        ]
      }
    ]
  },
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
