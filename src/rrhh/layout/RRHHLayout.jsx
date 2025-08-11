import { Toolbar } from '@mui/material';
import { Box } from '@mui/system'
import { NavBar, SideBar } from '../components';
import { useState } from 'react';


const drawerWidth = 300;

export const RRHHLayout = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  return (
    <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster'>
        <NavBar drawerWidth={ isDrawerOpen ? drawerWidth : 60 } />
        <SideBar drawerWidth={ drawerWidth } onDrawerChange={setIsDrawerOpen} />
        <Box 
            component='main'
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                minHeight: '100vh',
                width: { sm: `calc(100% - ${isDrawerOpen ? drawerWidth : 60}px)` },
                ml: { sm: `${isDrawerOpen ? 0 : - 240}px` },
                transition: 'all 0.3s ease-in-out'
            }}
        >
            <Toolbar />
            { children }
        </Box>
    </Box>
  )
}
