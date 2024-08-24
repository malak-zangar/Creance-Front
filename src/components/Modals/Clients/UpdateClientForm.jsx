import { Button, Form, Input, Modal, notification, Space, Tooltip , Switch, Select} from "antd";
import { useState,useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import api from "../../../utils/axios";

function UpdateClientForm({ record, handleState }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();
  const [relanceDisabled, setRelanceDisabled] = useState(false);
  const [unit, setUnit] = useState(() => record.delaiRelance % 7 === 0 ? "weeks" : "days");

  useEffect(() => {
    const initialDelai = record.delaiRelance;
    const isWeeks = initialDelai % 7 === 0 && initialDelai !== 0;
    setUnit(isWeeks ? "weeks" : "days");

    editForm.setFieldsValue({
      ...record,
      delaiRelance: isWeeks ? initialDelai / 7 : initialDelai,
    });

    if (record.delaiRelance === 0 && record.maxRelance === 0) {
      setRelanceDisabled(true);
    }
  }, [record, editForm]);

  const handleDisableChange = (checked) => {
    setRelanceDisabled(checked);
    if (checked) {
      editForm.setFieldsValue({ delaiRelance: 0, maxRelance: 0 });
    } else {
      const initialDelai = record.delaiRelance;
      const isWeeks = initialDelai % 7 === 0 && initialDelai !== 0;
      editForm.setFieldsValue({
        delaiRelance: isWeeks ? initialDelai / 7 : initialDelai,
        maxRelance: record.maxRelance,
      });
    }
  };

  const handleUpdate = () => {
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    editForm.setFieldsValue({ ...record });
  };

  const handleUpdateClient = () => {
    editForm
    .validateFields()
    .then((values) => {
      const delaiRelanceInDays =
        unit === "weeks" && !relanceDisabled
          ? values.delaiRelance * 7
          : values.delaiRelance;

      const dataToSend = {
        ...values,
        delaiRelance: delaiRelanceInDays,
      };
      
          Modal.confirm({
            title: "Confirmer la mise à jour du client",
            content: (
              <div>
Voulez vous vraiment valider les modifications?              </div>
            ),
            okText: "Confirmer",
            cancelText: "Annuler",
            onOk: () => {
              api
                .put(`/user/updateClient/${record.key}`, dataToSend)
                .then((response) => {
                  console.log(response)
                  handleState({
                    ...dataToSend,
                    key: record.key,
                  });
                  setIsEditModalVisible(false);
                  notification.success({
                    message: "Client mis à jour avec succès",
                  });
                })
                .catch((error) => {
                  notification.error({
                    description:
                      error?.response?.data?.erreur ||
                      `Une erreur est survenue lors de la mise à jour du client "${record.username}"`,
                  });
                });
            },
          });
           
        })
        .catch((error) => {
          console.error("Validation échouée:", error);
        });
    };

    const validateDelai = (rule, value) => {
      if (relanceDisabled && value === 0) {
        return Promise.resolve();
      }
      if (value < 1 || isNaN(value)) {
        return Promise.reject(new Error("Le délai de relance doit être supérieur à 1!"));
      }
      return Promise.resolve();
    };
  
    const validateMaxRelance = (rule, value) => {
      if (relanceDisabled && value === 0) {
        return Promise.resolve();
      }
      if (value < 1 || isNaN(value)) {
        return Promise.reject(new Error("Le max de relance doit être supérieur à 1!"));
      }
      return Promise.resolve();
    };

  const handleUnitChange = (value) => {
    const currentDelai = editForm.getFieldValue("delaiRelance");
    const updatedDelai =
      value === "weeks" ? currentDelai / 7 : currentDelai * 7;

    setUnit(value);
    editForm.setFieldsValue({
      delaiRelance: Math.round(updatedDelai),
    });
  };

  return (
    <>
      <Tooltip title="Modifier">
        <Button
          icon={<EditOutlined />}
          size="small"
          onClick={handleUpdate}
        ></Button>
      </Tooltip>
      <Modal
        title={"Modifier le client d'ID : " + record?.key}
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingUser(null);
        }}
        footer={null}
        style={{ top: 10 }}
      >
        <Form
          form={editForm}
          name="editClientForm"
          initialValues={editingUser}
          layout="vertical"
          //onFinish={handleConfirmEdit}
          onFinish={handleUpdateClient}
        >
          <Form.Item
            name="username"
            label="Nom du client"
            rules={[
              { required: true, message: "Veuillez saisir le nom du client!" },
              { min: 3, message: "Le nom doit comporter au moins 3 lettres!" },
              { max: 25, message: "Le nom doit comporter au plus 25 lettres!" },
              {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message: "Le nom ne doit pas commencer ou finir par un espace!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email de contact"
            rules={[
              { required: true, message: "Veuillez saisir l'email du client!" },
              { type: "email", message: "Veuillez saisir un email valide!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="emailcc"
            label="Email à copier en cc"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'email à copier en cc du client!",
              },
              { type: "email", message: "Veuillez saisir un email valide!" },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Téléphone"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le numéro de téléphone du client!",
              },

              {
                pattern: /^\d{7,15}$/,
                message:
                  "Le numéro de téléphone doit comporter entre 7 et 15 chiffres!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="identifiantFiscal"
            label="ID Fiscal"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'identifiant fiscal' du client!",
              },
              {
                pattern: /^[a-zA-Z0-9]{6,20}$/,
                message:
                  "L'identifiant fiscal doit comporter entre 6 et 20 caractères alphanumériques!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="adresse"
            label="Adresse"
            rules={[
              {
                required: true,
                message: "Veuillez saisir l'adresse du client!",
              },
              {
                min: 6,
                message: "L'adresse doit comporter au moins 6 lettres!",
              },
              {
                pattern: /^\S.*\S$|^\S{1,2}$/,
                message:
                  "L'adresse ne doit pas commencer ou finir par un espace!",
              },
            ]}
            style={{ marginBottom: "8px" }}
          >
            <Input />
          </Form.Item>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Switch
              size="small"
              checked={relanceDisabled}
              onChange={handleDisableChange}
            />
            <span style={{ margin: "8px" }}>Désactiver les relances</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
              gap: "10px",
            }}
          >
            <Form.Item
              name="delaiRelance"
              label="Délai de relance"
              style={{ margin: 0, flex: 1 }}
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le délai de relance!",
                },
                {
                  validator: validateDelai,
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Délai de relance"
                min={1}
                disabled={relanceDisabled}
                style={{ width: "170px" }}
                onKeyPress={(e) => {
                  if (e.key === "," || e.key === ".") {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              label=" "
              name="delaiUnit"
              style={{ margin: 0 }}
              initialValue={unit}
            >
              <Select
                value={unit}
                placeholder="Jours"
                disabled={relanceDisabled}
                onChange={handleUnitChange}
                style={{ width: "110px" }}
              >
                <Select.Option value="days">Jours</Select.Option>
                <Select.Option value="weeks">Semaines</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="maxRelance"
              label="Maximum de relance"
              style={{ margin: 0, flex: 1 }}
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le nombre maximum de relance!",
                },
                {
                  validator: validateMaxRelance,
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Max de relance"
                min={1}
                disabled={relanceDisabled}
                style={{ width: "170px" }}
                onKeyPress={(e) => {
                  if (e.key === "," || e.key === ".") {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Modifier
              </Button>
              <Button onClick={handleCancel}>Annuler</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateClientForm;