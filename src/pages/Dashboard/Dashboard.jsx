import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Spin, notification } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ComposedChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Sector,
  LabelList,
  Line,
} from "recharts";
import {
  EuroOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import api from "../../utils/axios";

const Dashboard = () => {
  const [data, setData] = useState({});
  const [pieData, setPieData] = useState([]);
  const [oldestFactures, setOldestFactures] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [caEvolution, setCAevolution] = useState([]);
  const [creanceEvolution, setCreanceEvolution] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await api.get("/dashboard/factureStats");
        const tauxResponse = await api.get("/dashboard/getTauxRecouvrement");
        const pourcentageResponse = await api.get(
          "/dashboard/getPourcentageFactures"
        );
        const oldestFacturesResponse = await api.get(
          "/dashboard/getOldestFactures"
        );
        const oldestUnpaidFacturesResponse = await api.get(
          "/dashboard/TopUnpaidClients"
        );
        const CAparMois = await api.get("/dashboard/CAevolution");

        const CreanceparMois = await api.get("/dashboard/CreanceEvolution");
        const contratActif = await api.get("/dashboard/totalContratActifs");

        setData({
          statsPayee: statsResponse.data["Payée"],
          statsEchue: statsResponse.data["Échue"],
          statsNonEchue: statsResponse.data["Non échue"],
          totalFactures: tauxResponse.data.total_factures,
          totalCA: tauxResponse.data.total_ca,
          totalPaye: tauxResponse.data.total_paye,
          tauxRecouvrement: tauxResponse.data.taux_recouvrement,
          pourcentageEchues: pourcentageResponse.data.pourcentage_echues,
          pourcentageNonEchues: pourcentageResponse.data.pourcentage_non_echues,
          nbrContratActif:contratActif.data.totalContrat,
          pourcentageActif:contratActif.data.pourcentageActif
        });
        setPieData([
          { name: "Échue", value: pourcentageResponse.data.echues },
          { name: "Non échue", value: pourcentageResponse.data.non_echues },
        ]);

        setBarChartData(oldestUnpaidFacturesResponse.data);

        console.log(barChartData);
        setOldestFactures(oldestFacturesResponse.data);

        setCAevolution(CAparMois.data);
        setCreanceEvolution(CreanceparMois.data);
 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        notification.error({
          description: "Error fetching data",
        });
      }
    };

    fetchData();
  }, []);

  const MontantAffiche = ({ montant }) => {
    const montantFormate = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(montant);
    return (
      <div>
        <p>{montantFormate}</p>
      </div>
    );
  };

  const FactureCount = ({ count }) => (
    <div className="absolute -top-3 -right-2 rounded-full px-3 py-1 bg-[#2f54eb] text-xs text-slate-50">
      {count} Factures
    </div>
  );
  const ContratCount = ({ count }) => (
    <div className="absolute -top-3 -right-2 rounded-full px-3 py-1 bg-[#365df7] text-xs text-slate-50">
      {count} Contrats
    </div>
  );

  const IconWrapper = ({ icon }) => (
    <div className="absolute bottom-2 right-2 text-xl text-gray-600">
      {icon}
    </div>
  );

  const columns = [
    {
      title: "Numéro Facture",
      dataIndex: "numero",
    },
    {
      title: "Nom Client",
      dataIndex: "client",
    },
    {
      title: "Retard",
      dataIndex: "retard",
      render: (retard) => <span style={{ color: "red" }}>{retard} jours</span>,
    },
    {
      title: "Montant",
      dataIndex: "montant",
      render: (montant) => <MontantAffiche montant={montant} />,
    },
  ];

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name} {payload.value}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#999"
        >
          {` ${(percent * 100).toFixed(2)}%`}
        </text>
      </g>
    );
  };

  const allMonths = [
    { mois: "01", name: "Janv", nameLong: "Janvier" },
    { mois: "02", name: "Févr", nameLong: "Février" },
    { mois: "03", name: "Mars", nameLong: "Mars" },
    { mois: "04", name: "Avr", nameLong: "Avril" },
    { mois: "05", name: "Mai", nameLong: "Mai" },
    { mois: "06", name: "Juin", nameLong: "Juin" },
    { mois: "07", name: "Juil", nameLong: "Juillet" },
    { mois: "08", name: "Aout", nameLong: "Aout" },
    { mois: "09", name: "Sept", nameLong: "Septembre" },
    { mois: "10", name: "Oct", nameLong: "Octobre" },
    { mois: "11", name: "Nov", nameLong: "Novembre" },
    { mois: "12", name: "Déc", nameLong: "Décembre" },
  ];

  const completeDataCA = allMonths.map((month) => {
    const existingData = caEvolution.find((data) => data.mois === month.mois);
    return existingData ? existingData : { mois: month.mois, total: 0 };
  });

  const completeDataCreance = allMonths.map((month) => {
    const existingData = creanceEvolution.find(
      (data) => data.mois === month.mois
    );
    return existingData ? existingData : { mois: month.mois, count: 0 };
  });

  const formatMonth = (tick) => {
    const month = allMonths.find((m) => m.mois === tick);
    return month ? month.name : tick;
  };

  const formatMonthLong = (tick) => {
    const month = allMonths.find((m) => m.mois === tick);
    return month ? month.nameLong : tick;
  };

  return loading ? (
    <div className="flex justify-center flex-col items-center h-full">
      <Spin size="large" />
    </div>
  ) : (
    <div>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          <div>
            <div className="relative">
              <Card size="small" title="Chiffre d'affaires"   style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
                <MontantAffiche montant={data.totalCA} />
                <IconWrapper icon={<EuroOutlined />} />
              </Card>
              <FactureCount count={data.totalFactures} />
            </div>
          </div>
          <div>
            <div className="relative">
              <Card size="small" title="Total encaissements" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
                <MontantAffiche montant={data.statsPayee?.total_montant} />
                <IconWrapper icon={<CheckCircleOutlined />} />
              </Card>
              <FactureCount count={data.statsPayee?.count} />
            </div>
          </div>
          <div>
            <div className="relative">
              <Card size="small" title="Créances non échues" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
                <MontantAffiche montant={data.statsNonEchue?.total_montant} />
                <IconWrapper icon={<ClockCircleOutlined />} />
              </Card>
              <FactureCount count={data.statsNonEchue?.count} />
            </div>
          </div>
          <div>
              <div className="relative">
                <Card size="small" title="Créances échues" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
                  <MontantAffiche montant={data.statsEchue?.total_montant} />
                  <IconWrapper icon={<CloseCircleOutlined />} />
                </Card>
                <FactureCount count={data.statsEchue?.count} />
              </div>
            </div>
          <ResponsiveContainer width="100%" height="100%">
            <Card size="small" className="w-full" title="Echues vs Non échues" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
              <div className="flex justify-center items-center h-full">
                <PieChart width={240} height={233}>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#e00b0b" : "#c2cbed"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            </Card>
          </ResponsiveContainer>
        </div>
        <div className="col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
           
            <div>
              <Card size="small" title="Taux de recouvrement" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
                {data.tauxRecouvrement?.toFixed(2)}%
                <IconWrapper icon={<PercentageOutlined />} />
              </Card>
            </div>

            <div>
            <div className="relative">
              <Card size="small" title="Contrats en cours" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
              {data.pourcentageActif?.toFixed(2)}%
                <IconWrapper icon={<ClockCircleOutlined />} />
              </Card>
              <ContratCount count={data.nbrContratActif} /> 
            </div>
          </div>
          </div>

          <Card size="small" title="Les 05 factures échues les plus anciennes" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <div style={{ overflowX: "auto" }}>
                <Table
                 scroll={{
                  x: "max-content"
                }}
                  size="small"
                  columns={columns}
                  rowKey="numero"
                  dataSource={oldestFactures}
                  pagination={false}
                />{" "}
              </div>
            </ResponsiveContainer>
          </Card>

          <Card size="small" title="Top 05 clients par créances impayées" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
            <ResponsiveContainer width="100%" height={233}>
              <ComposedChart
                layout="vertical"
                data={barChartData}
                margin={{
                  top: 15,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis
                  type="number"
                  tickFormatter={(value) => {
                    return new Intl.NumberFormat("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(value);
                  }}
                />
                <YAxis dataKey="client" type="category" />
                <Tooltip />
                <Bar dataKey="total" barSize={17} fill="#413ea0">
                  <LabelList
                    dataKey="total"
                    position="insideRight"
                    fill="#f0f1f7"
                    formatter={(value) => `${value}`}
                    content={({ x, y, width, height, value }) => {
                      const montantFormate = new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(value);

                      const offset = 10;
                      const isInBar = width > 40;
                      return (
                        <text
                          x={isInBar ? x + width - offset : x + width + offset}
                          y={y + height / 2}
                          fill={isInBar ? "#f0f1f7" : "#413ea0"}
                          textAnchor={isInBar ? "end" : "start"}
                          dominantBaseline="middle"
                        >
                          {montantFormate}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={12} xs={24} sm={24} md={12} style={{ marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <Card size="small" title="Evolution du CA en EUR" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
              <div className="flex justify-center items-center h-full">
                <ComposedChart
                  width={500}
                  height={300}
                  data={completeDataCA}
                  margin={{
                    top: 15,
                    left: 15,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis
                    type="category"
                    interval={0}
                    dataKey="mois"
                    tickFormatter={formatMonth}
                  />
                  <YAxis
                    type="number"
                    tickFormatter={(value) => {
                      return new Intl.NumberFormat("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(value);
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const { mois, total } = payload[0].payload;
                        return (
                          <div
                            style={{
                              backgroundColor: "#fff",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              padding: "7px",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                color: "#363391",
                                fontWeight: "bold",
                              }}
                            >
                              {formatMonthLong(mois)}
                            </p>
                            <p style={{ margin: 0, color: "#ff7300" }}>
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(total)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="total" barSize={17} fill="#363391" />
                  <Line type="monotone" dataKey="total" stroke="#ff7300" />
                </ComposedChart>
              </div>
            </Card>
          </ResponsiveContainer>
        </Col>
        <Col span={12} xs={24} sm={24} md={12} style={{ marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <Card size="small" title="Evolution des créances" style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.1)" }}>
              <div className="flex">
                <ComposedChart
                  width={500}
                  height={300}
                  data={completeDataCreance}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis
                    dataKey="mois"
                    interval={0}
                    tickFormatter={formatMonth}
                    type="category"
                  />
                  <YAxis />
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const { mois, count } = payload[0].payload;
                        return (
                          <div
                            style={{
                              backgroundColor: "#fff",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              padding: "7px",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                color: "#ff7300",
                                fontWeight: "bold",
                              }}
                            >
                              {formatMonthLong(mois)}
                            </p>
                            <p style={{ margin: 0, color: "#5956bf" }}>
                              {count}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" barSize={17} fill="#5956bf" />
                  <Line type="monotone" dataKey="count" stroke="#ff7300" />
                </ComposedChart>
              </div>
            </Card>
          </ResponsiveContainer>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
