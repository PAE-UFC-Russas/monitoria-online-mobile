import React, { useState, useEffect } from "react";
import { Keyboard, Image } from "react-native";
import { Center, VStack, View, Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import DefaultBlueButton from "../../components/DefaultBlueButton";
import DefaultFormInput from "../../components/DefaultFormInput";
import SelectForProfilePage from "../../components/SelectForProfilePage";
import DefaultSelect from "../../components/DefaultSelect";
import styles from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../../services/api";
import { GetLoginToken } from "../../util/StorageLogin";
import { ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/auth";

export default function StudentProfile() {
  const { goBack, navigate } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [personalData, setPersonalData] = useState({
    name: "",
    nickName: "",
    registration: "",
    entryYear: "",
    course: {
      id: null,
      nome: "",
    },
  });
  const [inputErros, setInputErros] = useState({
    errosNickName: null,
    errosName: null,
    errosRegistration: null,
    errosEntryear: null,
    errosCourse: null,
    responseErros: null,
  });
  const { CompleteRegister } = useAuth();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    let tempYears = [];
    for (let i = 2015; i <= currentYear; i++) {
      tempYears.push(i);
    }
    setYears(tempYears);

    async function GetCourses() {
      try {
        const response = await api.get("/cursos/", {
          headers: {
            Authorization: "Token " + (await GetLoginToken()),
          },
        });
        const listCourses = response.data.results;

        setCourses(listCourses);
      } catch (error) {
        console.log(error.response.data);
      }
    }
    GetCourses();
  }, []);

  const GetYearsPerSemester = () => {
    let tempYears = [];
    for (let i = 0; i < years.length; i++) {
      tempYears.push(years[i] + ".1");
      tempYears.push(years[i] + ".2");
    }
    return tempYears;
  };

  const InputValidation = async () => {
    setLoading(true);
    let erros = {
      errosName: null,
      errosNickName: null,
      errosEntryear: null,
      errosCourse: null,
      responseErros: null,
      errosRegistration: null,
    };

    if (personalData.name.trim().length < 3) {
      erros.errosName = "Nome inválido!";
    }
    if (
      !/^[0-9]+$/.test(personalData.registration.trim()) ||
      personalData.registration.length < 6 ||
      personalData.registration.length > 7
    ) {
      erros.errosRegistration = "Matrícula inválida!";
    }
    if (!personalData.nickName.trim()) {
      erros.errosNickName = "Nome de exibição inválido!";
    }
    if (!personalData.entryYear.trim()) {
      erros.errosEntryear = "Ano de entrada não pode está vazio!";
    }
    if (!personalData.course.id) {
      erros.errosCourse = "Curso não pode está vazio!";
    }

    setInputErros(erros);
    if (
      !erros.errosUser &&
      !erros.errosName &&
      !erros.errosNickName &&
      !erros.errosEntryear &&
      !erros.errosCourse &&
      !erros.errosRegistration
    ) {
      const response = await CompleteRegister(personalData);

      if (response === personalData.nome_exibicao) {
        return navigate("AddPhoto");
      } else {
        setInputErros({ ...erros, responseErros: response });
      }
    }

    setLoading(false);
    return null;
  };

  Keyboard.addListener("keyboardDidShow", () => {
    setKeyboardIsOpen(true);
  });
  Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardIsOpen(false);
  });

  return (
    <View style={styles.container} bgColor="#fff">
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <MaterialIcons
          onPress={() => goBack()}
          color="#024284"
          size={24}
          style={styles.backButton}
          name="arrow-back-ios"
        />
        <Center>
          <Image
            alt="Logo AMO"
            source={require("../../assets/logo_lightblue.png")}
            style={{ width: 60, height: 60 }}
          />
        </Center>
      </View>
      {!keyboardIsOpen && (
        <Text marginBottom={5} fontWeight="bold" color="#024284" fontSize="lg">
          Estamos quase lá
        </Text>
      )}

      <VStack width="5/6" space={5} marginBottom={2}>
        <DefaultFormInput
          value={personalData.name}
          placeholder={"Nome de usuario"}
          color={"#024284"}
          borderColor={"#024284"}
          setValue={(text) =>
            setPersonalData({
              ...personalData,
              name: text,
            })
          }
          error={inputErros.errosName}
        />
        <DefaultFormInput
          maxLength={64}
          value={personalData.nickName}
          placeholder={"Nome completo"}
          color={"#024284"}
          borderColor={"#024284"}
          setValue={(text) =>
            setPersonalData({ ...personalData, nickName: text })
          }
          error={inputErros.errosNickName}
        />
        <DefaultFormInput
          value={personalData.registration}
          placeholder={"Matricula"}
          color={"#024284"}
          borderColor={"#024284"}
          setValue={(text) =>
            setPersonalData({ ...personalData, registration: text })
          }
          maxLength={6}
          error={inputErros.errosRegistration}
        />
        <DefaultSelect
          borderWidth={3}
          items={GetYearsPerSemester()}
          placeholder={"Ano de entrada"}
          color={"#024284"}
          borderColor={"#024284"}
          value={personalData.entryYear}
          setValue={(itemValue) =>
            setPersonalData({ ...personalData, entryYear: itemValue })
          }
          error={inputErros.errosEntryear}
        />
        <SelectForProfilePage
          placeholder={"Selecionar curso"}
          color={"#024284"}
          borderColor={"#024284"}
          borderWidth={3}
          items={courses}
          setValue={(itemValue) =>
            setPersonalData({
              ...personalData,
              course: courses.filter((e) => e.id == itemValue)[0],
            })
          }
          error={inputErros.errosCourse}
        />
      </VStack>
      <DefaultBlueButton bgColor={"#2599BA"} onPress={InputValidation}>
        {loading ? <ActivityIndicator /> : "Avançar"}
      </DefaultBlueButton>
    </View>
  );
}
