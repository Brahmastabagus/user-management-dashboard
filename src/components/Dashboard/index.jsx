import {
  Container,
  Header,
  Sidebar,
  Sidenav,
  Content,
  Nav,
  Panel
} from 'rsuite';
// import { Icon } from '@rsuite/icons';
// import { FaReact } from 'react-icons/fa';
// import {
//   MdDashboard,
//   MdGroup,
//   MdSettings,
//   MdOutlineStackedBarChart,
//   MdKeyboardArrowLeft,
//   MdOutlineKeyboardArrowRight
// } from 'react-icons/md';
import { Link, Outlet, useLocation, useParams } from 'react-router';


const Brand = () => {
  return (
    <div className="w-full px-2 py-2 bg-primary text-white">
      {/* <FaReact size={26} /> */}
      <h3>Brand</h3>
    </div>
  );
};

const Index = () => {
  const location = useLocation()
  const { id } = useParams()
  return (
    <div className="w-full min-h-screen">
      <Container className="min-h-screen">
        <Sidebar
          style={{ display: 'flex', flexDirection: 'column' }}
          width={200}
          collapsible
        >
          <Sidenav.Header>
            <Brand />
          </Sidenav.Header>
          <Sidenav appearance="subtle">
            <Sidenav.Body>
              <Nav defaultActiveKey="1">
                <Nav.Item as={Link} to='/' eventKey="1" active={location.pathname === '/'}>
                  Dashboard
                </Nav.Item>
                <Nav.Item as={Link} to='/add-user' eventKey="2" active={location.pathname === '/add-user'}>
                  Add User
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </Sidebar>

        <Container className="min-h-screen">
          <Header className="page-header bg-primary text-white px-2 py-3">
            <h4>{(location.pathname === "/" && "Dashboard") || (location.pathname === "/add-user" && "Add User") || (id && "Edit User")}</h4>
          </Header>
          <Content className="bg-gray-100 p-2">
            <Panel className="bg-white rounded">
              <Outlet />
            </Panel>
          </Content>
        </Container>
      </Container>
    </div>
  );
};

export default Index;