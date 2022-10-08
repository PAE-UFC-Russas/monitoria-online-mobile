import React from 'react';
import {Text, Modal, HStack , Input, View, Select, Button, Center, VStack} from 'native-base';


export default function ModalScheduling({setOpenModal, openModal, navigation}){
    const HandleOnClose = () =>{
        setOpenModal(false)
    }

    return(
        <Modal 
            isOpen={openModal} 
            onClose={HandleOnClose} 
            marginTop={'5%'} 
        >
            <Modal.Content 
                padding='1' 
                bgColor='#fff'
                width='80%'
                height='70%'
                borderRadius={15}
            >
                <Center>
                    <Text 
                        fontSize={17} 
                        fontWeight='bold'
                        color='black'
                    >
                        Solicitar agendamento
                    </Text>
                </Center>

                <VStack style={{height:'90%', paddingHorizontal:'5%', paddingVertical:'3%'}}
                    space={2}
                >
                    <Text>
                        Assunto:
                    </Text>
                    <Input
                        borderColor='grey' 
                        color='#52D6FB' 
                        borderRadius={6} 
                        width='100%' 
                        height={'15%'}
                        placeholderTextColor='#52D6FB' 
                        placeholder='Digitar assunto aqui'
                    />
                    <Text>
                        Descrição:
                    </Text>
                    <Input
                        borderColor='grey' 
                        color='#52D6FB' 
                        borderRadius={6} 
                        width='100%' 
                        height={'15%'} 
                        placeholderTextColor='#52D6FB' 
                        placeholder='Digite sua dúvida'
                    />
                    <Text>
                        Disciplina:
                    </Text>
                    <Select 
                        placeholder='Seleciona a disciplina' 
                        height={10}
                        width={'100%'}
                        borderRadius={6} 
                        borderColor='grey'
                        placeholderTextColor='#52D6FB'
                        color='#52D6FB'
                    >
                        <Select.Item label='...' value='...'/>
                        <Select.Item label='...' value='...'/>
                    </Select>

                    <HStack 
                        style={{
                            height:'15%', 
                            marginVertical:'5%'
                        }}
                        space={5}
                    >
                        <View style={{width:'50%', flexDirection:'row',alignItems:'center'}}>
                            <Text style={{paddingRight:'5%'}}>
                                Data:
                            </Text>
                            <Input
                                borderColor='grey' 
                                color='#52D6FB' 
                                borderRadius={6} 
                                width='70%' 
                                height={'40%'}
                                placeholderTextColor='#52D6FB' 
                                placeholder='DD/MM/AAAA'
                            />
                        </View>
                        
                        <View style={{width:'50%', flexDirection:'row',alignItems:'center'}}>
                            <Text style={{paddingRight:'5%'}}>
                                Horario:
                            </Text>
                            <Input
                                borderColor='grey' 
                                color='#52D6FB' 
                                borderRadius={6}               
                                width='50%' 
                                height={'40%'}               
                                placeholderTextColor='#52D6FB' 
                                placeholder='HH/MM'
                            />
                        </View>
                    </HStack>
                    <HStack>
                        <Text style={{paddingRight:'5%'}}>
                            Tipo:
                        </Text>
                        <Select 
                            placeholder='Tipo' 
                            height={8}
                            width='150%'
                            borderRadius={6} 
                            borderColor='grey'
                            placeholderTextColor='#52D6FB'
                            color='#52D6FB'
                        >
                            <Select.Item label='...' value='...'/>
                            <Select.Item label='...' value='...'/>
                        </Select>
                    </HStack>

                    <Button style={{width:'80%',height:'9%',borderRadius: 16, alignSelf:'center', marginVertical:'10%'}}>Solicitar agendamento</Button>
                </VStack>
            </Modal.Content>
        </Modal>
    )
}