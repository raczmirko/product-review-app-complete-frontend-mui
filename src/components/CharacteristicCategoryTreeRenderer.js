import React from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

const renderAssignedCategoryTree = (categoryTreeList) => {
    if (!categoryTreeList) {
        return null;
    }

    return (
        <>
            <SimpleTreeView>
                {categoryTreeList.map(categoryTree => (
                    <TreeItem itemId={String(categoryTree.currentCategory.id)} key={categoryTree.currentCategory.id} label={categoryTree.currentCategory.name}>
                        {categoryTree.currentSubcategories.map(subcategory => (
                            <TreeItem itemId={String(subcategory.id)} key={subcategory.id} label={subcategory.name}>
                                {categoryTree.subSubcategories[subcategory.id] && categoryTree.subSubcategories[subcategory.id].map(subSubcategory => (
                                    <TreeItem itemId={String(subSubcategory.id)} key={subSubcategory.id} label={subSubcategory.name} />
                                ))}
                            </TreeItem>
                        ))}
                    </TreeItem>
                ))}
            </SimpleTreeView>
        </>
    );
};

export default renderAssignedCategoryTree;
