import { useState, useRef, useEffect } from "react";
import {
  SearchOutlined,UserSwitchOutlined,
  
} from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Typography,
  notification,
} from "antd";
import Highlighter from "react-highlight-words";
import { AddAdminForm } from "../../components/Modals/Admins/AddAdminForm";
import api from "../../utils/axios";

const Listeadmins = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, isNestedArray = false) => ({
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
          placeholder={`Rechercher ${dataIndex}`}
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
              width: 100,
            }}
          >
            Rechercher
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Réinitialiser
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
            Filtrer
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Fermer
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
    onFilter: (value, record) => {
      if (isNestedArray) {
        return record[dataIndex].some((item) =>
          item.reference.toLowerCase().includes(value.toLowerCase())
        );
      }
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    /* render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),*/
    render: (text, record) => {
      if (isNestedArray) {
        return text.map((contract) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              key={contract.id}
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={
                contract.reference ? contract.reference.toString() : ""
              }
            />
          ) : (
            <span
              key={contract.id}
              onClick={() => handleContractClick(contract)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {contract.reference}
            </span>
          )
        );
      }
      return searchedColumn === dataIndex ? (
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
      );
    },
  });

  const fetchData = async () => {
    try {
      const response = await api.get("/auth/getAll");
      const admins = response.data;
console.log(admins)
      const updatedadmins = await Promise.all(
        admins.map(async (admin) => {
          return {
            key: admin.id,
            username: admin.username,
            email: admin.email,
          };
        })
      );

      setData(updatedadmins);
      setLoading(false);

    } catch (error) {
      notification.error({
        message: "Une erreur lors de la récupération des admins!",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 
  const handleAddadminstate = (record) => {
    setData([record, ...data]);
  };

  
  const columns = [
    {
      title: "Nom d'utilisateur",
      dataIndex: "username",
      ...getColumnSearchProps("username"),
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),

    },
  ];

  return (
    <div>
      <Typography.Title level={4}>
      <span> <UserSwitchOutlined/> </span>

        Liste des administrateurs</Typography.Title>
      <Space className="mb-4">
        <AddAdminForm handleState={handleAddadminstate} />
      </Space>
      <Table
       scroll={{
        x: "max-content"
      }}
      loading={loading}
        size="small"
        columns={columns}
        dataSource={data}
        pagination={{
              total: data.length, 
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} éléments`,
              pageSize: 10,
            }} 
        showSorterTooltip={{ target: "sorter-icon" }}

      />
    </div>
  );
};

export default Listeadmins;
