import { TouchableOpacity, View } from 'react-native';
import { Avatar, Box, HStack, IconButton, Text } from 'native-base';
import { AntDesign } from '@expo/vector-icons'; 
import ImageModal from 'react-native-image-modal';
import ForumQuestionMenu from '../ForumQuestionMenu';
import DateISOToFormated from '../../util/DateISOToFormated';

export default function ForumQuest(quest, navigation, PostLike, DeleteLike, DeleteQuestion){
    return(
        <Box marginTop='3' width='5/6' justifyContent='space-between'>
            <HStack space='2'>
                <Avatar 
                    bg='tertiaryBlue' 
                    size='md' 
                    source={{
                        uri: !quest.autor.perfil.avatar?null:quest.autor.perfil.avatar
                    }}
                />
                <View style={{width: '100%'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('AnswerQuestion', quest)}>
                        <HStack justifyContent='space-between'>
                            <Text fontWeight='extrabold'>
                                {quest.autor.perfil.nome_exibicao}
                            </Text>
                            <ForumQuestionMenu DeleteQuestion={()=>DeleteQuestion(quest.id)}/>
                        </HStack>
                        <Text fontWeight='semibold'>
                            {quest.autor.cargos[0]}
                            {console.log(quest)}
                        </Text>
                        <Text fontWeight='semibold'>
                            {quest.titulo}
                        </Text>
                        <Text fontWeight='light'>
                            {quest.descricao}
                        </Text> 
                    </TouchableOpacity>
                    {
                        !!quest.content&&
                            <ImageModal
                                resizeMode='contain'
                                imageBackgroundColor='#fff'
                                alt='Conteúdo da dúvida'
                                style={{
                                    width: 340,
                                    height: 340
                                }}
                                source={{
                                    uri: quest.content,
                                }}
                            />
                    }
                    <HStack justifyContent='space-between'>
                        <Box alignItems='center' flexDirection='row'>
                            <Text>{quest.votos}</Text>
                            <IconButton onPress={() => quest.votou?DeleteLike(quest.id):PostLike(quest.id)} icon={
                                    <AntDesign
                                        color={quest.votou?'#f00':'#808080'}
                                        size={20}
                                        name={quest.votou>0?'heart':'hearto'}
                                    />
                                }
                            />
                            <Text marginLeft={3}>2</Text>
                            <IconButton onPress={() => navigation.navigate('AnswerQuestion', quest)} icon={
                                    <AntDesign
                                        color='#808080'
                                        size={20}
                                        name='message1'
                                    />
                                }
                            />
                        </Box>
                        <Text fontSize='xs' fontWeight='thin'>
                            {DateISOToFormated(quest.data)}
                        </Text>
                    </HStack>  
                </View>
            </HStack>
        </Box>
    )
};