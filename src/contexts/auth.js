import { createContext, useContext, useState } from 'react';
import { DeleteLoginToken, StoreLoginToken, GetLoginToken } from '../util/StorageLogin';
import api from '../services/api';

export const AuthContext = createContext({});

export default function AuthContextProvider({ children }){
    const [user, setUser] = useState({
        email: null,
        password: null,
        token: null,
        signed: false
    });

    async function Login(user){
        try{
            const response = await api.post('/usuario/login/', {
                "username": user.email,
                "password": user.password
            });

            const token = response.data.token;
            setUser({...user, token: token});

            if(user.signed){
                await StoreLoginToken(token);
            }

            return undefined
        }catch(error){
            return error.response.data
        }
    }

    async function Register(newUser){
        try{
            const response = await api.post('/usuario/registrar/', {
                "email": newUser.email,
                "password": newUser.password
            });

            setUser({...user, token: response.data.token});

            await StoreLoginToken(response.data.token);

        }catch(error){
            console.log(error.response)
            return error.response.data
        }
    }

    async function CompleteRegister(userData){
        try{
            const response = await api.patch(`/usuario/eu/`, {
                "perfil": {
                    "nome_completo": userData.name,
                    "nome_exibicao": userData.nickName,
                    "data_nascimento": userData.birthDate.toISOString().split('T')[0],
                    "matricula": userData.registration,
                    "entrada": userData.entryYear,
                    "curso": userData.course.id
                }
            },{
                headers: {
                    "Authorization": "Token " + await GetLoginToken()
                },
            });

            return response.data.nome_exibicao
        }catch(error){
            console.log(error.response)
            return error.response.data
        }
    }

    async function Active(token){
        try{
            await api.post('/usuario/ativar/', {
                "token": token
            },{
                headers: {
                    'Authorization': 'Token ' + user.token
                },
            });
            
            return true
        }catch(error){
            console.log(error.response);
            return "Falha ao ativar o token, verifique se o código está correto ou se o celular está conectado a internet!"
        }
    }

    async function Logout(){
        setUser({
            email: null,
            password: null,
            token: null,
            signed: false
        });
        await DeleteLoginToken();
    }

    async function IsConnected(){
        const token = await GetLoginToken();

        if(!token){
            try{
                await api.get('/cursos/', {
                    headers: {
                        'Authorization': 'Token ' + token()
                    }
                });
                return false
            }catch(error){
                console.log(error.response.data)
                return true
            }
        }else{
            return true
        }
    }

    return (
        <AuthContext.Provider value={{user, Login, Register, CompleteRegister, Active, Logout, IsConnected}}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(){
    const context = useContext(AuthContext);
   
    return context;
}