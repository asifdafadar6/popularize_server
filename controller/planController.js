const plan = require('../models/plan')


class planController {
    
    static createPlan = async (req, res) => {
        const body = req.body;
        try {

            if (!body.planname || !body.plantype) {
                return res.status(404).json({ msg: "Please provide all fields", success: false })
            }

            const insertplan = await plan.create({
                ...body,
            });

            return res.status(201).json({
                msg: "Plan Created Successfully",
                success: true,
                insertedData:insertplan
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Something wrong is happened in the backend" });
        }
    }

    static getAllPlans = async (req, res) => {
        try {
            const allPlans = await plan.find();
            return res.status(200).json({
                msg: "Plans retrieved successfully",
                success: true,
                data: allPlans
            });
        } catch (err) {
            console.error("Error in getAllPlans:", err);
            res.status(500).json({ msg: "Something went wrong in the backend", success: false });
        }
    };

    static getPlansById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || id.length !== 24) {
                return res.status(400).json({ msg: "Invalid ID format", success: false });
            }

            const planData = await plan.findById(id);

            if (!planData) {
                return res.status(404).json({ msg: "Plan not found", success: false });
            }

            return res.status(200).json({
                msg: "Plan retrieved successfully",
                success: true,
                data: planData
            });
        } catch (err) {
            console.error("Error in getPlansById:", err);
            res.status(500).json({ msg: "Something went wrong in the backend", success: false });
        }
    };

    static editPlans = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            if (!id || id.length !== 24) {
                return res.status(400).json({ msg: "Invalid ID format", success: false });
            }

            const updatedPlan = await plan.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updatedPlan) {
                return res.status(404).json({ msg: "Plan not found", success: false });
            }

            return res.status(200).json({
                msg: "Plan updated successfully",
                success: true,
                data: updatedPlan
            });
        } catch (err) {
            console.error("Error in editPlans:", err);
            res.status(500).json({ msg: "Something went wrong in the backend", success: false });
        }
    };

    static deletePlans = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || id.length !== 24) {
                return res.status(400).json({ msg: "Invalid ID format", success: false });
            }

            const deletedPlan = await plan.findByIdAndDelete(id);

            if (!deletedPlan) {
                return res.status(404).json({ msg: "Plan not found", success: false });
            }

            return res.status(200).json({
                msg: "Plan deleted successfully",
                success: true
            });
        } catch (err) {
            console.error("Error in deletePlans:", err);
            res.status(500).json({ msg: "Something went wrong in the backend", success: false });
        }
    };
}

module.exports = planController;