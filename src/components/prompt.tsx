import { DefaultButton, IconButton, Modal, PrimaryButton, Stack, Text } from "@fluentui/react";

interface PromptProps {
    isOpen: boolean,
    title: string,
    content: any,
    onAccept: () => void,
    onCancel: () => void
}

export function Prompt(props: PromptProps) {
    return (
    <Modal isOpen={props.isOpen} 
        styles={{ main: { minWidth: '400px', maxWidth: '600px' } }}
        onDismiss={() => props.onCancel()} isBlocking={false}
    >
        <div style={{
            padding: '20px', whiteSpace: 'nowrap', overflow: 'hidden',
            textOverflow: 'ellipsis', maxWidth: '550px', 
            }}>
            <span>
                <Text styles={{ root: { fontSize: '32px' } }}>{props.title}</Text>
            </span>
            <IconButton iconProps={{ iconName: 'Cancel' }}
                styles={{ root: { float: 'right' } }}
                ariaLabel="Close popup modal"
                onClick={() => props.onCancel()}
            />
        </div>
        <div style={{ padding: '20px' }}>
            {
                typeof props.content === 'string' ?
                    <Text>{props.content}</Text>
                    :
                    props.content
            }
        </div>
        <Stack styles={{ root: { padding: '20px' } }} tokens={{ childrenGap: 20 }} horizontal reversed>
            <DefaultButton text="Cancel" onClick={() => props.onCancel()} />
            <PrimaryButton text="Accept" onClick={() => props.onAccept()} />
        </Stack>
    </Modal>);
}