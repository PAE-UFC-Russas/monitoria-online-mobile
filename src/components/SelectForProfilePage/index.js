import { FormControl, Select } from 'native-base';

export default function SelectForProfilePage({placeholder, setValue, color, error, items, backgroundColor}){
    return (
        <FormControl isInvalid={error?true:false}>
            <Select 
                backgroundColor={backgroundColor}
                accessibilityLabel={placeholder}
                minWidth='5/6'
                placeholder={placeholder}
                placeholderTextColor={color}
                borderColor={color}
                color={color}
                borderRadius={15}
                _selectedItem={{
                    bg: color
                }}
                _text={{
                    fontSize: '3xl'
                }}
                onValueChange={setValue}
            >
                {items.map((item, index)=>{
                    return <Select.Item key={index} label={`${item.nome}`} value={`${item.id}`}/>
                })}
            </Select>
            <FormControl.ErrorMessage>
                {error}
            </FormControl.ErrorMessage>
        </FormControl>
    )
}