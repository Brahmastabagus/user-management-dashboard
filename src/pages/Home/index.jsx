import { useEffect, useState, useTransition } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteUser, getUser, setSearchTerm } from "../../store/userSlice"
import { Button, DOMHelper, Input, InputGroup, Modal, Pagination, Stack, Table } from "rsuite"
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import optionToast from "../../constants/optionToast";

const { Column, HeaderCell, Cell } = Table;
const { getHeight } = DOMHelper;

const Index = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [isDelete, setIsDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [idUser, setIdUser] = useState(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status } = useSelector(state => state.userSlice)
  const { defaultData, searchTerm } = useSelector((state) => state.userSlice)

  useEffect(() => {
    if (status === "idle") dispatch(getUser())
  }, [status, dispatch])

  useEffect(() => {
    if (searchTerm !== '') {
      setSearchKeyword(searchTerm)
    }
  }, [searchTerm])

  const handleChangeLimit = dataKey => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = defaultData.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const filteredData = () => {
    const filtered = data.filter(item => {
      const nameMatch = item?.name?.toLowerCase()?.includes(searchKeyword.toLowerCase()) || false;
      const emailMatch = item?.email?.toLowerCase()?.includes(searchKeyword.toLowerCase()) || false;

      return nameMatch || emailMatch;
    });

    if (sortColumn && sortType) {
      const sorted = [...filtered].sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];

        if (typeof x === 'string') {
          x = x.toLowerCase();
          y = y.toLowerCase();
        }

        if (sortType === 'asc') {
          return x.localeCompare(y);
        } else {
          return y.localeCompare(x);
        }
      });

      return sorted;
    }
    return filtered;
  };

  const handleOpenDelete = (id) => {
    setIdUser(id)
    setIsDelete(true);
  }
  const handleCloseDelete = () => setIsDelete(false);

  const handleDeleteUser = () => {
    startTransition(() => {
      dispatch(deleteUser(idUser));
      toast.success(`User deleted successfully`, optionToast);
      handleCloseDelete()
    })
  };
  return (
    <>
      <Stack className='flex justify-between mb-5' spacing={6}>
        <Button appearance="primary" className='!bg-primary text-white'
          onClick={() => navigate(`/add-user`)}
        >
          Add User
        </Button>

        <InputGroup inside>
          <Input placeholder="Search" value={searchKeyword} onChange={e => {
            setSearchKeyword(e)
            dispatch(setSearchTerm(e))
          }} />
          <InputGroup.Addon>
            <svg className="size-4" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path></svg>
          </InputGroup.Addon>
        </InputGroup>
      </Stack>
      <Table
        height={Math.max(getHeight(window) - 200, 400)}
        data={filteredData()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        // wordWrap="break-words"
        autoHeight
        rowHeight={80}
        loading={status === "loading"}
      >
        <Column width={50} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell>
            {(_, rowIndex) => rowIndex + 1}
          </Cell>
        </Column>

        <Column flexGrow={1} fullText>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1} fullText>
          <HeaderCell>Company</HeaderCell>
          <Cell dataKey="company" />
        </Column>

        <Column flexGrow={1} fullText>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>Action</HeaderCell>
          <Cell style={{ padding: '6px' }}>
            {rowData => (
              <div className='flex place-content-center h-full gap-1'>
                <Button className='hover:!bg-green-500 group h-fit' onClick={() => navigate(`/edit-user/${rowData.id}`)}>
                  <svg className='size-4 group-hover:text-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.24264 17.9967H3V13.754L14.435 2.319C14.8256 1.92848 15.4587 1.92848 15.8492 2.319L18.6777 5.14743C19.0682 5.53795 19.0682 6.17112 18.6777 6.56164L7.24264 17.9967ZM3 19.9967H21V21.9967H3V19.9967Z"></path></svg>
                </Button>
                <Button className='hover:!bg-red-500 group h-fit' onClick={() => handleOpenDelete(rowData.id)}>
                  <svg className='size-4 group-hover:text-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM9 11V17H11V11H9ZM13 11V17H15V11H13ZM9 4V6H15V4H9Z"></path></svg>
                </Button>
              </div>
            )}
          </Cell>
        </Column>
      </Table>
      <div style={{ padding: 20 }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={['total', '-', 'limit', '|', 'pager', 'skip']}
          total={defaultData.length}
          limitOptions={[20, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>

      <Modal backdrop="static" role="alertdialog" open={isDelete} onClose={!isPending && handleCloseDelete} size="sm">
        <Modal.Body>
          <svg className="size-6" style={{ color: '#ffb300', fontSize: 24 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.8659 3.00017L22.3922 19.5002C22.6684 19.9785 22.5045 20.5901 22.0262 20.8662C21.8742 20.954 21.7017 21.0002 21.5262 21.0002H2.47363C1.92135 21.0002 1.47363 20.5525 1.47363 20.0002C1.47363 19.8246 1.51984 19.6522 1.60761 19.5002L11.1339 3.00017C11.41 2.52187 12.0216 2.358 12.4999 2.63414C12.6519 2.72191 12.7782 2.84815 12.8659 3.00017ZM4.20568 19.0002H19.7941L11.9999 5.50017L4.20568 19.0002ZM10.9999 16.0002H12.9999V18.0002H10.9999V16.0002ZM10.9999 9.00017H12.9999V14.0002H10.9999V9.00017Z"></path></svg> Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-red-500' color="red" onClick={handleDeleteUser} loading={isPending} appearance="primary">
            Delete
          </Button>
          <Button className='bg-slate-100' onClick={handleCloseDelete} appearance="subtle" loading={isPending}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Index