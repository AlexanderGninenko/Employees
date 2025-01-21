const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();

    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ message: "Не удалось получить сотрудников" });
  }
};

const addEmployee = async (req, res, next) => {
  try {
    const data = req.body;
    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({ message: "Не указаны все поля" });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    return res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: "Что-то пошло не так" });
  }
};

module.exports = { getAllEmployees, addEmployee };
