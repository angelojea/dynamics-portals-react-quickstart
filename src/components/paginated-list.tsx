import { DefaultButton, IButtonStyles, Icon, IShimmeredDetailsListProps, ShimmeredDetailsList, Stack } from "@fluentui/react";
import { useState } from "react";
import { generateRandomStr } from "../services";

const paginationBtnStyle: IButtonStyles = { root: { minWidth: '40px', maxWidth: '40px' } };

export function PaginatedList(props: PaginatedListProps) {
    const [pageSize, setPageSize] = useState(props.pageSize);

    const totalPages = Math.ceil(props.items.length / pageSize);
    const pages = [];
    for (let i = 0; i < totalPages; i++) pages.push({ pageNumber: i, text: i + 1 + '' })

    const pageNumber = props.pageNumber;
    const startIndex = pageNumber * pageSize;
    const endIndex = startIndex + pageSize;

    const itemsSlice = props.items.slice(startIndex, endIndex);

    const paginated = (newPageNumber: number) => {
        if (props.onPaginated) props.onPaginated(newPageNumber);
    }

    return <>
        <ShimmeredDetailsList {...props} items={itemsSlice}/>
        <Stack className="mt-3" tokens={{childrenGap:10}} horizontal styles={{ root: { justifyContent: 'center' } }}>
            <DefaultButton styles={paginationBtnStyle}
                disabled={pageNumber <= 0}
                onClick={() => paginated(0)}
            ><Icon iconName="DoubleChevronLeftMed" /></DefaultButton>
            <DefaultButton styles={paginationBtnStyle} 
                disabled={pageNumber <= 0}
                onClick={() => paginated(pageNumber - 1)}
            ><Icon iconName="ChevronLeftMed" /></DefaultButton>
            {
                pages.map(x => <DefaultButton key={generateRandomStr(6)}
                    text={x.text}
                    disabled={x.pageNumber === pageNumber}
                    styles={paginationBtnStyle}
                    onClick={() => paginated(x.pageNumber)}
                    />)
            }
            <DefaultButton styles={paginationBtnStyle} 
                disabled={pageNumber >= (totalPages - 1)}
                onClick={() => paginated(pageNumber + 1)}
            ><Icon iconName="ChevronRightMed" /></DefaultButton>
            <DefaultButton styles={paginationBtnStyle} 
                disabled={pageNumber >= (totalPages - 1)}
                onClick={() => paginated(totalPages - 1)}
            ><Icon iconName="DoubleChevronLeftMedMirrored" /></DefaultButton>
        </Stack>
    </>
}

export interface PaginatedListProps extends IShimmeredDetailsListProps {
    pageSize: number,
    pageNumber: number,
    onPaginated?: (pageNumber: number) => void
}