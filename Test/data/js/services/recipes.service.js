/**
 * Service de gestion des recettes de produits
 * Gère les tables Recipes et RecipesStep dans Supabase
 */

import dbConnection from '../config/database.js';

const EMPTY_PRODUCT_ID = 29;
const PROTECTED_RECIPE_ID = 1;
const DEFAULT_QTY_UNIT = 'g';

class RecipesService {
    constructor() {
        this.db = null;
    }

    /**
     * Initialise le service
     */
    async init() {
        this.db = await dbConnection.init();
        return this;
    }

    /**
     * Récupère toutes les recettes
     */
    async getAllRecipes() {
        try {
            const { data, error } = await this.db
                .from('Recipes')
                .select('*')
                .order('id');

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erreur lors de la récupération des recettes:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Récupère une recette par son ID avec ses étapes
     */
    async getRecipeById(recipeId) {
        try {
            const { data: recipe, error: recipeError } = await this.db
                .from('Recipes')
                .select('*')
                .eq('id', recipeId)
                .single();

            if (recipeError) throw recipeError;

            const { data: steps, error: stepsError } = await this.db
                .from('RecipesStep')
                .select('*')
                .eq('RecipeId', recipeId)
                .order('Step');

            if (stepsError) throw stepsError;

            return {
                success: true,
                data: {
                    ...recipe,
                    steps: steps || []
                }
            };
        } catch (error) {
            console.error('Erreur lors de la récupération de la recette:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Récupère les recettes par produit de sortie
     */
    async getRecipesByProduct(productId) {
        try {
            const { data, error } = await this.db
                .from('Recipes')
                .select('*')
                .eq('ProductId', productId)
                .order('Version', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Erreur lors de la récupération des recettes par produit:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Crée une nouvelle recette
     */
    async createRecipe(recipeData, steps = []) {
        try {
            // Validation des données
            if (!recipeData.Name || recipeData.Name.trim() === '') {
                throw new Error('Le nom de la recette est requis');
            }

            // Calculer le délai total à partir des étapes
            const totalDelay = this._calculateTotalDelay(steps);

            // Préparer les données de la recette
            const recipe = {
                Name: recipeData.Name,
                ProductId: recipeData.ProductId || null,
                ProductionQty: recipeData.ProductionQty || 1,
                ProductionDelayMin: totalDelay,
                Notes: recipeData.Notes || null,
                Version: 1
            };

            // Insérer la recette
            const { data: newRecipe, error: recipeError } = await this.db
                .from('Recipes')
                .insert([recipe])
                .select()
                .single();

            if (recipeError) throw recipeError;

            // Ajouter les étapes si fournies
            if (steps && steps.length > 0) {
                const stepsResult = await this._createRecipeSteps(newRecipe.id, steps);
                if (!stepsResult.success) {
                    throw new Error(stepsResult.error);
                }
            }

            return {
                success: true,
                data: await this.getRecipeById(newRecipe.id)
            };
        } catch (error) {
            console.error('Erreur lors de la création de la recette:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Met à jour une recette existante
     */
    async updateRecipe(recipeId, recipeData, steps = null) {
        try {
            // Vérifier que ce n'est pas la recette protégée
            if (recipeId === PROTECTED_RECIPE_ID) {
                throw new Error('La recette vide (ID 1) ne peut pas être modifiée');
            }

            // Récupérer la version actuelle
            const { data: currentRecipe, error: fetchError } = await this.db
                .from('Recipes')
                .select('Version')
                .eq('id', recipeId)
                .single();

            if (fetchError) throw fetchError;

            // Calculer le nouveau délai total si des étapes sont fournies
            let totalDelay = recipeData.ProductionDelayMin;
            if (steps !== null) {
                totalDelay = this._calculateTotalDelay(steps);
            }

            // Préparer les données de mise à jour
            const updateData = {
                Version: currentRecipe.Version + 1
            };

            if (recipeData.Name !== undefined) updateData.Name = recipeData.Name;
            if (recipeData.ProductId !== undefined) updateData.ProductId = recipeData.ProductId;
            if (recipeData.ProductionQty !== undefined) updateData.ProductionQty = recipeData.ProductionQty;
            if (recipeData.Notes !== undefined) updateData.Notes = recipeData.Notes;
            updateData.ProductionDelayMin = totalDelay;

            // Mettre à jour la recette
            const { error: updateError } = await this.db
                .from('Recipes')
                .update(updateData)
                .eq('id', recipeId);

            if (updateError) throw updateError;

            // Mettre à jour les étapes si fournies
            if (steps !== null) {
                // Supprimer les anciennes étapes
                await this.db
                    .from('RecipesStep')
                    .delete()
                    .eq('RecipeId', recipeId);

                // Créer les nouvelles étapes
                if (steps.length > 0) {
                    const stepsResult = await this._createRecipeSteps(recipeId, steps);
                    if (!stepsResult.success) {
                        throw new Error(stepsResult.error);
                    }
                }
            }

            return {
                success: true,
                data: await this.getRecipeById(recipeId)
            };
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la recette:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Supprime une recette
     */
    async deleteRecipe(recipeId) {
        try {
            // Vérifier que ce n'est pas la recette protégée
            if (recipeId === PROTECTED_RECIPE_ID) {
                throw new Error('La recette vide (ID 1) ne peut pas être supprimée');
            }

            // Les étapes seront supprimées automatiquement grâce à ON DELETE CASCADE
            const { error } = await this.db
                .from('Recipes')
                .delete()
                .eq('id', recipeId);

            if (error) throw error;

            return { success: true, message: 'Recette supprimée avec succès' };
        } catch (error) {
            console.error('Erreur lors de la suppression de la recette:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Ajoute une étape à une recette
     */
    async addRecipeStep(recipeId, stepData) {
        try {
            // Vérifier que ce n'est pas la recette protégée
            if (recipeId === PROTECTED_RECIPE_ID) {
                throw new Error('La recette vide (ID 1) ne peut pas être modifiée');
            }

            // Récupérer le numéro de la prochaine étape
            const { data: existingSteps } = await this.db
                .from('RecipesStep')
                .select('Step')
                .eq('RecipeId', recipeId)
                .order('Step', { ascending: false })
                .limit(1);

            const nextStep = existingSteps && existingSteps.length > 0 
                ? existingSteps[0].Step + 1 
                : 1;

            // Valider et préparer les données de l'étape
            const step = this._validateStepData({
                ...stepData,
                RecipeId: recipeId,
                Step: stepData.Step || nextStep
            });

            // Insérer l'étape
            const { data, error } = await this.db
                .from('RecipesStep')
                .insert([step])
                .select()
                .single();

            if (error) throw error;

            // Mettre à jour le délai total de la recette
            await this._updateRecipeDelay(recipeId);

            return { success: true, data };
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'étape:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Met à jour une étape de recette
     */
    async updateRecipeStep(stepId, stepData) {
        try {
            // Récupérer l'étape pour vérifier la recette
            const { data: existingStep, error: fetchError } = await this.db
                .from('RecipesStep')
                .select('RecipeId')
                .eq('id', stepId)
                .single();

            if (fetchError) throw fetchError;

            // Vérifier que ce n'est pas la recette protégée
            if (existingStep.RecipeId === PROTECTED_RECIPE_ID) {
                throw new Error('La recette vide (ID 1) ne peut pas être modifiée');
            }

            // Valider les données
            const updateData = {};
            if (stepData.Step !== undefined) updateData.Step = stepData.Step;
            if (stepData.Action !== undefined) updateData.Action = stepData.Action;
            if (stepData.ProductId !== undefined) {
                updateData.ProductId = stepData.ProductId;
                // Appliquer les règles de validation
                if (stepData.ProductId !== EMPTY_PRODUCT_ID) {
                    updateData.Qty = stepData.Qty || 0;
                    updateData.DelayMin = stepData.DelayMin || 0;
                    updateData.QtyUnit = stepData.QtyUnit || DEFAULT_QTY_UNIT;
                } else {
                    updateData.Qty = 0;
                    updateData.DelayMin = 0;
                }
            }

            // Mettre à jour l'étape
            const { error: updateError } = await this.db
                .from('RecipesStep')
                .update(updateData)
                .eq('id', stepId);

            if (updateError) throw updateError;

            // Mettre à jour le délai total de la recette
            await this._updateRecipeDelay(existingStep.RecipeId);

            return { success: true, message: 'Étape mise à jour avec succès' };
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'étape:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Supprime une étape de recette
     */
    async deleteRecipeStep(stepId) {
        try {
            // Récupérer l'étape pour vérifier la recette
            const { data: existingStep, error: fetchError } = await this.db
                .from('RecipesStep')
                .select('RecipeId')
                .eq('id', stepId)
                .single();

            if (fetchError) throw fetchError;

            // Vérifier que ce n'est pas la recette protégée
            if (existingStep.RecipeId === PROTECTED_RECIPE_ID) {
                throw new Error('La recette vide (ID 1) ne peut pas être modifiée');
            }

            // Supprimer l'étape
            const { error } = await this.db
                .from('RecipesStep')
                .delete()
                .eq('id', stepId);

            if (error) throw error;

            // Mettre à jour le délai total de la recette
            await this._updateRecipeDelay(existingStep.RecipeId);

            return { success: true, message: 'Étape supprimée avec succès' };
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'étape:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Réorganise les étapes d'une recette
     */
    async reorderRecipeSteps(recipeId, stepOrders) {
        try {
            // Vérifier que ce n'est pas la recette protégée
            if (recipeId === PROTECTED_RECIPE_ID) {
                throw new Error('La recette vide (ID 1) ne peut pas être modifiée');
            }

            // Mettre à jour chaque étape avec son nouveau numéro
            for (const { stepId, newOrder } of stepOrders) {
                const { error } = await this.db
                    .from('RecipesStep')
                    .update({ Step: newOrder })
                    .eq('id', stepId)
                    .eq('RecipeId', recipeId);

                if (error) throw error;
            }

            // Incrémenter la version de la recette
            const { data: currentRecipe } = await this.db
                .from('Recipes')
                .select('Version')
                .eq('id', recipeId)
                .single();

            await this.db
                .from('Recipes')
                .update({ Version: currentRecipe.Version + 1 })
                .eq('id', recipeId);

            return { success: true, message: 'Étapes réorganisées avec succès' };
        } catch (error) {
            console.error('Erreur lors de la réorganisation des étapes:', error);
            return { success: false, error: error.message };
        }
    }

    // Méthodes privées

    /**
     * Crée plusieurs étapes pour une recette
     * @private
     */
    async _createRecipeSteps(recipeId, steps) {
        try {
            const validatedSteps = steps.map((step, index) => 
                this._validateStepData({
                    ...step,
                    RecipeId: recipeId,
                    Step: step.Step || index + 1
                })
            );

            const { error } = await this.db
                .from('RecipesStep')
                .insert(validatedSteps);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Valide et normalise les données d'une étape
     * @private
     */
    _validateStepData(stepData) {
        const step = {
            RecipeId: stepData.RecipeId,
            Step: stepData.Step || 1,
            Action: stepData.Action || '',
            ProductId: stepData.ProductId || EMPTY_PRODUCT_ID,
            QtyUnit: stepData.QtyUnit || DEFAULT_QTY_UNIT
        };

        // Si le produit n'est pas le produit vide, il doit avoir une quantité et un délai
        if (step.ProductId !== EMPTY_PRODUCT_ID) {
            step.Qty = stepData.Qty || 0;
            step.DelayMin = stepData.DelayMin || 0;
        } else {
            // Sinon, les valeurs sont à zéro
            step.Qty = 0;
            step.DelayMin = 0;
        }

        return step;
    }

    /**
     * Calcule le délai total à partir des étapes
     * @private
     */
    _calculateTotalDelay(steps) {
        if (!steps || steps.length === 0) return 1;
        
        return steps.reduce((total, step) => {
            const delay = step.DelayMin || 0;
            return total + delay;
        }, 0) || 1; // Minimum 1 minute
    }

    /**
     * Met à jour le délai total d'une recette à partir de ses étapes
     * @private
     */
    async _updateRecipeDelay(recipeId) {
        try {
            // Récupérer toutes les étapes
            const { data: steps, error: stepsError } = await this.db
                .from('RecipesStep')
                .select('DelayMin')
                .eq('RecipeId', recipeId);

            if (stepsError) throw stepsError;

            // Calculer le délai total
            const totalDelay = this._calculateTotalDelay(steps);

            // Récupérer la version actuelle
            const { data: currentRecipe } = await this.db
                .from('Recipes')
                .select('Version')
                .eq('id', recipeId)
                .single();

            // Mettre à jour la recette
            const { error: updateError } = await this.db
                .from('Recipes')
                .update({ 
                    ProductionDelayMin: totalDelay,
                    Version: currentRecipe.Version + 1
                })
                .eq('id', recipeId);

            if (updateError) throw updateError;

            return { success: true };
        } catch (error) {
            console.error('Erreur lors de la mise à jour du délai:', error);
            return { success: false, error: error.message };
        }
    }
}

// Instance singleton
const recipesService = new RecipesService();

// Exporter pour utilisation dans d'autres modules
export default recipesService;
