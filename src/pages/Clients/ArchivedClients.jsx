import { useState, useRef, useEffect } from "react";
import { Button, Input, Space, Table,Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RetweetOutlined, SearchOutlined,UserOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const ArchivedClients = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleRestaure = (key) => {
    console.log("restaure record with key: ", key);
    axios
      .put(`http://localhost:5551/user/restaurerClient/${key}`)
      .then((response) => {
        console.log("Client restaured successfully:", response.data);
      })
      .catch((error) => {
        console.error("There was an error restauring the client!", error);
      });
  };

 
  const fetchData = () => {
    axios
      .get("http://localhost:5551/user/getAllArchived")
      .then((response) => {
        setData(
          response.data.map((client) => ({
            key: client.id,
            username: client.username,
            email: client.email,
            phone: client.phone,
            adresse: client.adresse,
          }))
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the clients!", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const ToListActif = () => {
    console.log("Button ToListActif clicked");
    navigate("/clients/actif");
  };



  const columns = [
    {
      title: "Client",
      dataIndex: "username",
      ...getColumnSearchProps("username"),
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Téléphone",
      dataIndex: "phone",
    },
    {
      title: "Adresse",
      dataIndex: "adresse",
      ...getColumnSearchProps("adresse"),
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Button
          icon={<RetweetOutlined />}
          onClick={() => handleRestaure(record.key)}
        >
          Restaurer
        </Button>
      ),
    },
  ];


  return (
    <div >
        <Typography.Title level={2}>Liste de tous les clients archivés</Typography.Title>
        <Space className="mb-4">

        <Button icon={<UserOutlined />}
        onClick={ToListActif}
    size="small"
      >
        Clients actifs
      </Button></Space>
      <Table       size="small"
 columns={columns} dataSource={data}  pagination={{
          pageSize: 6,
        }} />
    </div>
  );
};

export default ArchivedClients;
