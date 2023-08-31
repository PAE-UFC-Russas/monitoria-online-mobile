import React, { useEffect, useState } from "react";
import { TouchableOpacity, Platform, Image } from "react-native";
import {
   Center,
   Text,
   View,
   Avatar,
   Input,
   Button,
   useToast,
   ScrollView,
   HStack
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PickImage from "../../util/PickImage";
import { GetLoginToken } from "../../util/StorageLogin";
import { useAuth } from "../../contexts/auth";
import SelectForProfilePage from "../../components/SelectForProfilePage";
import DefaultSelect from "../../components/DefaultSelect";
import api from "../../services/api";
import styles from "./styles";

export default function EditProfile() {
   const { goBack } = useNavigation();
   const toast = useToast();
   const [courses, setCourses] = useState([]);
   const [years, setYears] = useState([]);
   const { user, EditUser } = useAuth();
   const [profile, setProfile] = useState({
      nome_exibicao: user.perfil.nome_exibicao,
      entrada: user.perfil.entrada,
      curso: -1,
      foto: ""
   });

   const GetYearsPerSemester = () => {
      let tempYears = [];
      for (let i = 0; i < years.length; i++) {
         tempYears.push(years[i] + ".1");
         tempYears.push(years[i] + ".2");
      }
      return tempYears;
   };

   const GetImage = async () => {
      const avatar = await PickImage();
      setProfile({ ...profile, foto: avatar });
   };

   const Save = async () => {
      if (!profile.nome_exibicao || profile.curso === -1 || !profile.entrada) {
         toast.show({
            title: "Não deixe nenhum campo em branco!",
            placement: "bottom",
         });
      } else {
         const formData = new FormData();

         if (profile.foto != null) {
            if (profile.foto.indexOf("onrender") == -1) {
               const randomNumberForPhoto = Math.floor(Math.random() * (1000000 - 1) + 1)
               formData.append("foto", {
                  uri:
                     Platform.OS === "ios"
                        ? profile.foto.replace("file://", "")
                        : profile.foto,
                  name: profile.nome_exibicao + randomNumberForPhoto + "foto.jpg",
                  fileName:
                     profile.nome_exibicao + randomNumberForPhoto +
                     "foto.jpg",
                  type: "image/jpeg",
               });
            }
         }
         formData.append(
            "nome_exibicao",
            !profile.nome_exibicao ? user.nome_exibicao : profile.nome_exibicao
         );
         formData.append("curso", profile.curso);
         formData.append("entrada", profile.entrada);

         try {
            const response = await fetch("https://amo-backend.onrender.com/usuario/eu/", {
               method: "PATCH",
               headers: {
                  Authorization: "Token " + (await GetLoginToken()),
                  "Content-Type": "multipart/form-data",
               },
               body: formData,
            });
            const newEditedUser = await response.json()
            EditUser(newEditedUser)
            goBack();
            toast.show({
               title: "Dados cadastrados com sucesso!",
               placement: "bottom",
            });
         } catch (error) {
            toast.show({
               title: "Erro, verifique sua internet!",
               placement: "bottom",
            });
            console.log(error);
         }
      }
   };

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

   return (
      <View style={styles.container}>
         <ScrollView>
         <HStack justifyContent="space-between" alignSelf={'center'} safeArea>
               
            <Text alignSelf="center" fontSize={25} color={"#52D6FB"} > Editar Perfil </Text>
         </HStack>
            <Center justifyContent={"center"} alignItems={"center"}>
               <TouchableOpacity onPress={() => GetImage()}>
                  {
                     profile.foto ? 
                        <Image source={{ uri: profile.foto }} style={{ width: 100, height: 100, margin: 5, borderRadius: 100 }} />
                     :
                        <Avatar
                           alignSelf="center"
                           bg="tertiaryBlue"
                           margin={5}
                           size="xl"
                           source={{
                              uri: user.perfil.foto.length > 0?`https://${user.perfil.foto}`:"https://i.ibb.co/4f1jsPx/Splash-1.png",
                           }}
                        />
                  }
                  <View style={styles.avatarBadge}>
                     <FontAwesome5 color="#fff" size={16} name="pen" />
                  </View>
               </TouchableOpacity>
            </Center>
            <View>
               <Text marginTop={2} fontSize={15}>
                  Nome de exibição
               </Text>
               <Input
                  color={"#52D6FB"}
                  borderWidth={1}
                  borderColor={"#52D6FB"}
                  placeholder="Digite seu nome de exibição"
                  fontSize={15}
                  onChangeText={(text) =>
                     setProfile({ ...profile, nome_exibicao: text })
                  }
                  value={profile.nome_exibicao}
                  variant="outline"
                  borderRadius={15}
                  backgroundColor="#fff"
               />
               <Text marginTop={5} fontSize={15}>
                  Curso
               </Text>
               <SelectForProfilePage
                  borderWidth={1}
                  backgroundColor="white"
                  style={{ color: "black", backgroundColor: "white" }}
                  placeholder="Escolha seu curso"
                  items={courses}
                  setValue={(itemValue) =>
                     setProfile({
                        ...profile,
                        curso: courses.filter((e) => e.id == itemValue)[0].id,
                     })
                  }
                  color="#52D6FB"
               />

               <Text marginTop={5} fontSize={15}>
                  Entrada
               </Text>
               <DefaultSelect
                  borderWidth={1}
                  style={{ color: "white", backgroundColor: "white" }}
                  backgroundColor="white"
                  placeholder="Ano de entrada"
                  items={GetYearsPerSemester()}
                  value={profile.entrada}
                  setValue={(itemValue) =>
                     setProfile({ ...profile, entrada: itemValue })
                  }
                  color="#52D6FB"
               />
            </View>
            <View style={styles.buttons}>
               <Button
                  borderWidth={2}
                  borderColor="#52D6FB"
                  variant="outline"
                  borderRadius={10}
                  width={100}
                  _text={{
                     color: "#4B4A4A",
                  }}
                  onPress={() => goBack()}
               >
                  Cancelar
               </Button>
               <Button
                  bgColor="#52D6FB"
                  borderRadius={10}
                  width={100}
                  onPress={Save}
               >
                  Salvar
               </Button>
            </View>
         </ScrollView>
      </View>
   );
}
