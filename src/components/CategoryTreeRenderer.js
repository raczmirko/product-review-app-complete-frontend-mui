// CategoryTreeRenderer.js

import React from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

const renderCategoryTree = (categoryTree) => {
    if (!categoryTree || !categoryTree.currentCategory) {
        return null;
    }

    const { currentCategory, currentParentCategory, currentSubcategories, subSubcategories, parentParentCategory } = categoryTree;

    {/* Expand the tree until current category and select current category*/}
    const selectedItemIDs = [];
    const expandedItemIDs = [];
    if (parentParentCategory) {
        expandedItemIDs.push(parentParentCategory.id);
    }
    if (currentParentCategory) {
        expandedItemIDs.push(currentParentCategory.id);
    }
    expandedItemIDs.push(currentCategory.id);
    selectedItemIDs.push(currentCategory.id);

    return (
        <>
            <SimpleTreeView defaultExpandedItems={expandedItemIDs} defaultSelectedItems={selectedItemIDs}>
                {/* Render from parentParentCategory if exists */}
                {parentParentCategory && (
                    <TreeItem itemId={parentParentCategory.id} label={parentParentCategory.name}>
                        {/* Render currentParentCategory */}
                        {currentParentCategory && (
                            <TreeItem itemId={currentParentCategory.id} label={currentParentCategory.name}>
                                {/* Render currentCategory */}
                                <TreeItem itemId={currentCategory.id} label={currentCategory.name}>
                                    {/* Render currentSubcategories */}
                                    {currentSubcategories.map(subcategory => (
                                        <TreeItem itemId={subcategory.id} label={subcategory.name}>
                                            {/* Render subSubcategories */}
                                            {subSubcategories[subcategory.id] && subSubcategories[subcategory.id].map(subSubcategory => (
                                                <TreeItem itemId={subSubcategory.id} label={subSubcategory.name} />
                                            ))}
                                        </TreeItem>
                                    ))}
                                </TreeItem>
                            </TreeItem>
                        )}
                    </TreeItem>
                )}
                {/* Render from currentParentCategory if exists */}
                {!parentParentCategory && currentParentCategory && (
                    <TreeItem itemId={currentParentCategory.id} label={currentParentCategory.name}>
                        {/* Render currentCategory */}
                        <TreeItem itemId={currentCategory.id} label={currentCategory.name}>
                            {/* Render currentSubcategories */}
                            {currentSubcategories.map(subcategory => (
                                <TreeItem itemId={subcategory.id} label={subcategory.name}>
                                    {/* Render subSubcategories */}
                                    {subSubcategories[subcategory.id] && subSubcategories[subcategory.id].map(subSubcategory => (
                                        <TreeItem itemId={subSubcategory.id} label={subSubcategory.name} />
                                    ))}
                                </TreeItem>
                            ))}
                        </TreeItem>
                    </TreeItem>
                    
                )}
                {/* Render from currentCategory */}
                {!parentParentCategory && !currentParentCategory && (
                    <TreeItem itemId={currentCategory.id} label={currentCategory.name}>
                        {currentSubcategories.map(subcategory => (
                            <TreeItem itemId={subcategory.id} label={subcategory.name}>
                                {/* Render subSubcategories */}
                                {subSubcategories[subcategory.id] && subSubcategories[subcategory.id].map(subSubcategory => (
                                    <TreeItem itemId={subSubcategory.id} label={subSubcategory.name} />
                                ))}
                            </TreeItem>
                        ))}
                    </TreeItem>
                )}
            </SimpleTreeView>
        </>
    );
};

export default renderCategoryTree;
