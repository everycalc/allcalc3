export const calculatorDescriptions: { [key: string]: { description: string; faqs: { q: string; a: string }[] } } = {
    'E-commerce Profit Calculator': {
        description: 'Analyze your per-order profitability with precision. This calculator accounts for all major e-commerce costs, including COGS, shipping (both forward and reverse), payment gateway fees, and RTO losses, giving you a true picture of your blended profit per order.',
        faqs: [
            {
                q: 'What is blended profit?',
                a: 'Blended profit is your average profit across all orders, factoring in both successfully delivered orders and costly returned (RTO) orders. It gives you a more realistic view of your business\'s health than looking at delivered orders alone.'
            },
            {
                q: 'Why is my Return-to-Origin (RTO) rate so important?',
                a: 'A high RTO rate can severely damage profitability. For every RTO, you lose money on forward shipping, reverse shipping, packaging, and potentially the cost of the product itself if it\'s damaged. Reducing your RTO rate is one of the fastest ways to increase profits.'
            }
        ]
    },
    'Product Cost Calculator': {
        description: 'Calculate the total cost to produce one unit of your product. This tool breaks down costs into materials, labor, packaging, and overheads, providing a clear cost-per-unit. Use this to set a profitable selling price by adding your desired profit margin.',
        faqs: [
            {
                q: 'What is the difference between direct and indirect (overhead) costs?',
                a: 'Direct costs, like materials and labor, are directly tied to producing a single unit. Indirect or overhead costs, like rent or software subscriptions, are general business expenses that must be distributed across all units produced to get a true cost.'
            },
            {
                q: 'Why is accurate product costing important?',
                a: 'Accurate costing is the foundation of a profitable business. It allows you to set the right price, understand your profit margins, identify areas to reduce costs, and make informed decisions about which products to promote or discontinue.'
            }
        ]
    },
    'Recipe Cost Calculator': {
        description: 'Perfect for restaurants, bakeries, and food creators. This calculator helps you determine the exact cost of a single serving of your recipe by breaking down the cost of each ingredient. Input the market price and size of your ingredients, and how much you use, to find your precise food cost.',
        faqs: [
            {
                q: 'How do I account for ingredient waste?',
                a: 'A common industry practice is to add a small percentage (e.g., 5-10%) to your final recipe cost to account for potential waste like spoilage, trimming, or cooking errors. You can do this by slightly increasing the "used amount" for key ingredients.'
            },
            {
                q: 'How does this help with menu pricing?',
                a: 'Knowing your exact recipe cost is crucial for menu pricing. A general rule is that your food cost should be around 25-35% of your menu price, leaving the rest to cover labor, overheads, and profit.'
            }
        ]
    },
    'CLV & CAC Calculator': {
        description: 'Understand the essential metrics for sustainable business growth: Customer Lifetime Value (CLV) and Customer Acquisition Cost (CAC). This calculator helps you determine the total profit you can expect from a customer over their lifetime and compares it to the cost of acquiring them.',
        faqs: [
            {
                q: 'What is a good CLV to CAC ratio?',
                a: 'A healthy CLV:CAC ratio is typically considered to be 3:1 or higher. This means for every dollar you spend to acquire a customer, you get three dollars in profit back over their lifetime. A ratio below 1:1 means you are losing money on each new customer.'
            },
            {
                q: 'How can I improve my CLV?',
                a: 'You can increase CLV by encouraging repeat purchases through loyalty programs, improving customer service to reduce churn, and increasing the average order value through upselling or cross-selling.'
            }
        ]
    },
    'Inventory Management Calculator': {
        description: 'Optimize your inventory with two key metrics: Economic Order Quantity (EOQ) and Reorder Point (ROP). EOQ tells you the ideal quantity of inventory to order to minimize holding and ordering costs, while ROP tells you when to place that order to avoid stockouts.',
        faqs: [
            {
                q: 'What is Safety Stock?',
                a: 'Safety stock is an extra quantity of a product which is stored in the warehouse to prevent an out-of-stock situation. It acts as a buffer against uncertainties in demand or supply lead time.'
            },
            {
                q: 'What is the difference between ordering cost and holding cost?',
                a: 'Ordering costs are the expenses incurred to create and process an order to a supplier (e.g., shipping fees, administrative costs). Holding costs are the costs associated with storing inventory that is waiting to be sold (e.g., warehouse rent, insurance, spoilage).'
            }
        ]
    },
    'Break-Even ROAS Calculator': {
        description: 'Find your Break-Even Return On Ad Spend (ROAS). This vital calculator considers your product costs, shipping, and even return rates to tell you the exact ROAS you need to achieve on your advertising campaigns just to cover your costs and break even.',
        faqs: [
            {
                q: 'What is ROAS?',
                a: 'ROAS stands for Return On Ad Spend. It\'s a marketing metric that measures the amount of revenue your business earns for each dollar it spends on advertising. A ROAS of 3, for example, means you make $3 in revenue for every $1 spent on ads.'
            },
            {
                q: 'Why is my break-even ROAS higher than I thought?',
                a: 'Break-even ROAS isn\'t just about covering the ad spend; it has to cover the cost of the product, shipping, fees, and even losses from returns. This is why the break-even point is often higher than just 1.0.'
            }
        ]
    },
    'Break-Even Point Calculator': {
        description: 'Determine the point at which your revenue equals your costs. The Break-Even Point calculator helps you find out how many units you need to sell, or how much revenue you need to generate, to cover all your fixed and variable costs without making a profit or a loss.',
        faqs: [
            {
                q: 'What are fixed vs. variable costs?',
                a: 'Fixed costs are expenses that do not change regardless of the number of units sold (e.g., rent, salaries). Variable costs are expenses that change in direct proportion to the number of units sold (e.g., raw materials, direct labor).'
            },
            {
                q: 'How can I lower my break-even point?',
                a: 'You can lower your break-even point by either reducing your fixed costs (e.g., finding cheaper rent), reducing your variable costs per unit (e.g., finding a cheaper supplier), or increasing your selling price per unit.'
            }
        ]
    },
    'Profit Margin Calculator': {
        description: 'Quickly calculate your gross profit and profit margin percentage. This calculator helps you understand the profitability of your sales by comparing your revenue to your Cost of Goods Sold (COGS). A key indicator for business health.',
        faqs: [
            {
                q: 'What is the difference between Gross Profit and Profit Margin?',
                a: 'Gross Profit is the absolute monetary amount left over from revenue after subtracting the Cost of Goods Sold (e.g., $40). Profit Margin is that amount expressed as a percentage of revenue (e.g., 40%), which is useful for comparing profitability across different products or periods.'
            },
            {
                q: 'What is a good profit margin?',
                a: 'A "good" profit margin varies widely by industry. A retail business might have a margin of 20-30%, while a software company could have a margin of 80% or more. It\'s best to compare your margin to your industry\'s average.'
            }
        ]
    },
    'Discount Calculator': {
        description: 'Calculate the final price of an item after a discount has been applied. This tool also shows you exactly how much money you are saving, making it perfect for shopping and sales promotions.',
        faqs: [
            {
                q: 'How do I calculate a discount?',
                a: 'To calculate a discount, you convert the percentage to a decimal (e.g., 20% = 0.20) and multiply it by the original price. This gives you the saved amount. Subtract the saved amount from the original price to get the final price.'
            },
            {
                q: 'How do I calculate a price before a discount was applied?',
                a: 'To find the original price, you can use our GST/Tax calculator in "remove" mode. For example, if you paid $80 after a 20% discount, you can input 80 as the Final Amount and 20 as the Tax Rate to find the original price.'
            }
        ]
    },
    'AOV Calculator': {
        description: 'Calculate your Average Order Value (AOV). This calculator helps you understand the average amount of money each customer spends per transaction, a key metric for online businesses to track and improve.',
        faqs: [
            {
                q: 'Why is AOV important?',
                a: 'Increasing your AOV is one of the most effective ways to grow your revenue without needing more customers. A higher AOV means you are maximizing the value of each customer you acquire.'
            },
            {
                q: 'How can I increase my AOV?',
                a: 'Common strategies include offering free shipping over a certain threshold, bundling products together for a slight discount, and suggesting relevant add-ons or upsells during the checkout process.'
            }
        ]
    },
    'Loan Calculator': {
        description: 'Our Loan Calculator helps you determine the monthly payments (EMI) for a loan. By entering the loan amount, interest rate, and term, you can see a detailed breakdown of your repayment schedule, including how much you will pay in principal versus interest over the life of the loan.',
        faqs: [
            {
                q: 'What is EMI?',
                a: 'EMI stands for Equated Monthly Installment. It is the fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full.'
            },
            {
                q: 'How is loan interest calculated?',
                a: 'Most loans use a reducing balance method. The interest is calculated on the outstanding loan amount for the month. As you pay your EMIs, the principal amount reduces, and so does the interest charged on it in subsequent months.'
            }
        ]
    },
    'SIP Calculator': {
        description: 'A Systematic Investment Plan (SIP) calculator helps you estimate the future value of your mutual fund investments made through SIP. Enter your monthly investment amount, expected annual return rate, and the investment duration to project your potential wealth accumulation over time.',
        faqs: [
            {
                q: 'What is a SIP?',
                a: 'A Systematic Investment Plan (SIP) is a method of investing in mutual funds where you invest a fixed amount of money at regular intervals (e.g., monthly). It helps in disciplined investing and benefits from rupee cost averaging and the power of compounding.'
            },
            {
                q: 'Are the returns guaranteed?',
                a: 'No, mutual fund returns are subject to market risks. The calculator shows a projection based on the expected rate of return you enter. Actual returns can be higher or lower depending on market performance.'
            }
        ]
    },
    'FD/RD Calculator': {
        description: 'Calculate the maturity amount and interest earned on your Fixed Deposit (FD) or Recurring Deposit (RD). This tool helps you plan your savings by showing you how your money can grow over a fixed period with a fixed interest rate.',
        faqs: [
            {
                q: 'What is the difference between an FD and an RD?',
                a: 'In a Fixed Deposit (FD), you invest a lump sum amount one time for a fixed tenure. In a Recurring Deposit (RD), you invest a fixed amount every month for a fixed tenure. FDs are for those with a lump sum, while RDs are for those who want to save monthly.'
            },
            {
                q: 'What does compounding frequency mean for an FD?',
                a: 'Compounding frequency is how often the interest is calculated and added to your principal. More frequent compounding (e.g., quarterly) results in slightly higher returns than less frequent compounding (e.g., annually) because you start earning interest on your interest sooner.'
            }
        ]
    },
    'Mutual Fund Returns Calculator': {
        description: 'Estimate the future value of your mutual fund investments, whether you are investing a one-time lump sum amount or through a monthly Systematic Investment Plan (SIP). This helps you visualize the power of compounding on your investments.',
        faqs: [
            {
                q: 'What is the difference between SIP and Lumpsum?',
                a: 'SIP involves investing a fixed amount regularly (usually monthly), which helps average out your purchase cost over time. Lumpsum is a one-time, large investment, which can be beneficial if you invest when the market is low.'
            },
            {
                q: 'What is an "expected return rate"?',
                a: 'Since mutual fund returns are not guaranteed, the "expected return rate" is an assumption you make based on the fund\'s past performance and market outlook. A common long-term expectation for equity funds is 10-12%, but this is not guaranteed.'
            }
        ]
    },
    'Compound Interest Calculator': {
        description: 'Discover the power of compounding with this calculator. See how your initial investment can grow over time as you earn interest not just on your principal amount, but also on the accumulated interest from previous periods.',
        faqs: [
            {
                q: 'Why is compound interest so powerful?',
                a: 'Compound interest is powerful because it creates a snowball effect. As your investment earns interest, the interest itself starts earning interest, leading to exponential growth over long periods. Albert Einstein reportedly called it the "eighth wonder of the world".'
            },
            {
                q: 'What is the Rule of 72?',
                a: 'The Rule of 72 is a simple way to estimate how long it will take for an investment to double. Just divide 72 by your annual interest rate. For example, an investment at an 8% annual return will double in approximately 9 years (72 / 8 = 9).'
            }
        ]
    },
    'Credit Card Interest Calculator': {
        description: 'Calculate the total interest you will pay and the time it will take to pay off your credit card debt. This tool helps you understand the true cost of credit card debt and can motivate you to create a payoff plan.',
        faqs: [
            {
                q: 'What is APR (Annual Percentage Rate)?',
                a: 'APR is the annual rate of interest charged on your credit card balance. However, credit card interest is typically compounded daily or monthly, so the effective interest rate is often higher than the stated APR.'
            },
            {
                q: 'Why does paying only the minimum take so long?',
                a: 'Minimum payments are often set very low, sometimes just enough to cover the interest for that month and a tiny fraction of the principal. This means most of your payment goes to interest, and the balance decreases very slowly, keeping you in debt for years.'
            }
        ]
    },
    'Home Loan EMI & Affordability': {
        description: 'Plan your home purchase with confidence. This calculator not only computes your Equated Monthly Installment (EMI) for a home loan but also helps you check if the loan is affordable based on your monthly income and existing financial commitments.',
        faqs: [
            {
                q: 'What is the 50% rule for affordability?',
                a: 'Many lenders and financial advisors recommend that your total monthly EMI payments (including this home loan and any other existing loans like car loans) should not exceed 50% of your net monthly income. This ensures you have enough money left for other living expenses.'
            },
            {
                q: 'What is the difference between a fixed and floating interest rate?',
                a: 'A fixed interest rate remains the same for the entire loan tenure, providing predictable EMI payments. A floating interest rate is linked to market rates and can change over the loan tenure, meaning your EMI amount could increase or decrease.'
            }
        ]
    },
    'GST/Tax Calculator': {
        description: 'Easily add or remove Goods and Services Tax (GST) or any other percentage-based tax from an amount. This is useful for business owners to determine the pre-tax price from a final price, or for consumers to see the final cost of a product.',
        faqs: [
            {
                q: 'What is the difference between adding and removing GST?',
                a: '"Adding GST" calculates the final price when you know the base price (e.g., 1000 + 18% GST). "Removing GST" calculates the base price when you only know the final, tax-inclusive price (e.g., finding the original price from a 1180 receipt).'
            },
            {
                q: 'Can this be used for other taxes like VAT?',
                a: 'Yes, absolutely. This calculator can be used for any percentage-based tax, such as Value Added Tax (VAT), sales tax, or service tax. Just enter the appropriate tax rate.'
            }
        ]
    },
    'Area Cost Estimator': {
        description: 'Quickly estimate the total cost of a project based on its area. Whether you are planning to build a house, tile a floor, or paint a wall, this calculator helps you budget by multiplying the total area by the cost per square unit.',
        faqs: [
            {
                q: 'What costs are included in "cost per square foot/meter"?',
                a: 'This figure can vary. For construction, it might include materials and labor. For flooring or painting, it might just be the cost of the material. It\'s important to know what your cost per unit figure represents to get an accurate estimate.'
            },
            {
                q: 'How can I get an accurate cost per unit figure?',
                a: 'The best way is to get quotes from contractors or suppliers in your specific area, as costs can vary significantly by location. You can also research local construction cost reports for a general idea.'
            }
        ]
    },
    'Rent vs Buy Calculator': {
        description: 'Analyze the financial implications of renting a property versus buying one. This calculator compares the total cost of renting against the total cost of buying (including down payment and EMIs) over a specified period to help you make a more informed decision.',
        faqs: [
            {
                q: 'Does this calculator include all costs of buying?',
                a: 'This is a simplified financial comparison. It does not include other potential costs of homeownership like property taxes, maintenance, insurance, or potential appreciation in property value. It focuses primarily on the cash outflow of down payment and EMIs vs. rent.'
            },
            {
                q: 'When does buying make more sense than renting?',
                a: 'Generally, buying becomes more financially advantageous the longer you plan to stay in the home. This is because you have more time to pay down the loan principal and for the property value to potentially appreciate, offsetting the high initial costs.'
            }
        ]
    },
    'Carpet Area vs Built-up Area': {
        description: 'Understand the key terms used in real estate. This calculator helps you convert between Carpet Area (the usable area within the walls of your apartment) and Built-up Area (which includes the area of the walls and balconies).',
        faqs: [
            {
                q: 'What is Super Built-up Area?',
                a: 'Super Built-up Area is an even larger figure that includes the built-up area plus a proportionate share of common areas like lobbies, staircases, and clubhouses. It\'s often used by developers to calculate the final sale price.'
            },
            {
                q: 'What percentage is typical for non-carpet areas?',
                a: 'The area taken up by walls, balconies, and shafts typically ranges from 15% to 25% of the built-up area. This means the carpet area is usually 75-85% of the built-up area.'
            }
        ]
    },
    'Percentage Calculator': {
        description: 'A versatile tool for all your percentage calculation needs. Whether you need to find a percentage of a number, determine what percentage one number is of another, or calculate the percentage change between two numbers, this calculator has you covered.',
        faqs: [
            {
                q: 'How do I calculate a percentage increase?',
                a: 'Use the "% Change" mode. Enter the original number in the "From" field and the new, larger number in the "To" field. The result will be a positive percentage.'
            },
            {
                q: 'What is a real-world use for the "X is what %" calculation?',
                a: 'This is very useful for exams or goals. If you scored 45 marks out of a total of 60, you can calculate (45 is what % of 60) to find your score is 75%.'
            }
        ]
    },
    'Average Calculator': {
        description: 'Calculate the average (or arithmetic mean) of a set of numbers. Simply enter your numbers separated by commas, and the calculator will provide the sum, count, and average of the values.',
        faqs: [
            {
                q: 'What is the difference between average (mean) and median?',
                a: 'The average (mean) is the sum of all values divided by the count of values. The median is the middle value in a sorted list of numbers. The median is often a better measure of central tendency when there are extreme outliers.'
            },
            {
                q: 'Can I use negative numbers?',
                a: 'Yes, you can include negative numbers in your list. The calculator will correctly factor them into the sum and the final average.'
            }
        ]
    },
    'Median & Mode Calculator': {
        description: 'Find the median (the middle value) and the mode (the most frequently occurring value) of a data set. These are important statistical measures that help you understand the central tendency of your data.',
        faqs: [
            {
                q: 'When should I use the median instead of the average?',
                a: 'The median is a better measure when your data has extreme outliers because it is not affected by them. For example, when calculating the "average" house price in an area, the median is often used to avoid a few mansions skewing the result.'
            },
            {
                q: 'What if there is more than one mode?',
                a: 'A data set can have more than one mode. If two numbers appear with the same highest frequency, the set is "bimodal". If three, it is "trimodal". This calculator will show all modes.'
            }
        ]
    },
    'Logarithm & Trigonometry': {
        description: 'A handy tool for students and professionals dealing with advanced mathematics. Quickly calculate common logarithms (log base 10), natural logarithms (ln), and trigonometric functions like sine, cosine, and tangent in either degrees or radians.',
        faqs: [
            {
                q: 'What is the difference between log and ln?',
                a: '"log" typically refers to the common logarithm with base 10, used in fields like chemistry (pH scale). "ln" refers to the natural logarithm with base e (Euler\'s number, ~2.718), which is widely used in calculus, physics, and finance.'
            },
            {
                q: 'What are degrees and radians?',
                a: 'Both are units for measuring angles. A full circle is 360 degrees or 2π radians. Degrees are commonly used in general geometry, while radians are preferred in higher-level mathematics and physics for their convenient properties in calculus.'
            }
        ]
    },
    'Standard Calculator': {
        description: 'Your everyday tool for basic arithmetic operations. This standard calculator handles addition, subtraction, multiplication, and division with a clean, simple interface and a running display of your calculation.',
        faqs: [
            {
                q: 'How does the percentage button (%) work?',
                a: 'The percentage button works in context. For example, `100 + 10%` will calculate 10% of 100 (which is 10) and add it to 100, giving 110. `100 * 10%` will calculate 10% of 100, which is 10.'
            },
            {
                q: 'What is the order of operations?',
                a: 'This standard calculator processes operations sequentially as they are entered (e.g., `2 + 3 * 4` will be calculated as `5 * 4 = 20`). For strict mathematical order (PEMDAS/BODMAS), use the Scientific Calculator.'
            }
        ]
    },
    'Scientific Calculator': {
        description: 'Perform advanced mathematical calculations with our Scientific Calculator. It includes functions for trigonometry (sin, cos, tan), logarithms (log, ln), powers, roots, and constants like π and e.',
        faqs: [
            {
                q: 'How do I use the y^x button?',
                a: 'The y^x button is for calculating exponents. To calculate 5 to the power of 3 (5³), you would enter `5`, press `y^x`, enter `3`, and then press `=`. The result is 125.'
            },
            {
                q: 'What is "Deg/Rad" mode?',
                a: 'This switch changes the unit for trigonometric calculations. "Deg" stands for degrees (where a circle has 360°). "Rad" stands for radians (where a circle has 2π radians). Ensure you are in the correct mode for your problem.'
            }
        ]
    },
    'Force & Acceleration': {
        description: 'Calculate Force, Mass, or Acceleration using Newton\'s Second Law of Motion (F=ma). Enter any two of the variables, and this calculator will solve for the third, making it a great tool for physics students and engineers.',
        faqs: [
            {
                q: 'What units are used in this calculator?',
                a: 'This calculator uses standard SI units: Force is in Newtons (N), Mass is in kilograms (kg), and Acceleration is in meters per second squared (m/s²).'
            },
            {
                q: 'What is the difference between mass and weight?',
                a: 'Mass is the amount of matter in an object and is constant everywhere. Weight is the force of gravity acting on that mass (Weight = mass × gravitational acceleration). Your mass is the same on Earth and the Moon, but your weight is different.'
            }
        ]
    },
    'Velocity & Distance': {
        description: 'Solve for Speed (Velocity), Distance, or Time using the fundamental formula: Distance = Speed × Time. Input any two of the values, and the calculator will find the missing one, perfect for planning trips or solving physics problems.',
        faqs: [
            {
                q: 'What is the difference between speed and velocity?',
                a: 'In physics, speed is a scalar quantity (how fast an object is moving, e.g., 60 km/h), while velocity is a vector quantity (speed in a specific direction, e.g., 60 km/h North). In this calculator, the terms are used interchangeably for simplicity.'
            },
            {
                q: 'What units does this calculator use?',
                a: 'This calculator uses kilometers per hour (km/h) for speed, kilometers (km) for distance, and hours (h) for time. Ensure your inputs are in these units for an accurate result.'
            }
        ]
    },
    'All Shapes Area Calculator': {
        description: 'A versatile geometry tool to calculate the area of various common shapes, including circles, squares, rectangles, and triangles. Simply select your shape, enter the required dimensions, and get the area instantly.',
        faqs: [
            {
                q: 'What is the formula for the area of a circle?',
                a: 'The area of a circle is calculated using the formula A = πr², where \'r\' is the radius of the circle and π (Pi) is approximately 3.14159.'
            },
            {
                q: 'How do I calculate the area of a complex shape?',
                a: 'You can often calculate the area of a complex shape by breaking it down into simpler shapes (like rectangles and triangles). Calculate the area of each simple shape individually and then add them together.'
            }
        ]
    },
    'All Shapes Volume Calculator': {
        description: 'Calculate the volume of common three-dimensional shapes, including spheres, cubes, cylinders, and cones. Select the shape, input the dimensions, and find the total volume the shape can hold.',
        faqs: [
            {
                q: 'What is the formula for the volume of a sphere?',
                a: 'The volume of a sphere is calculated using the formula V = (4/3)πr³, where \'r\' is the radius of the sphere.'
            },
            {
                q: 'What is the relationship between volume and capacity?',
                a: 'Volume is the amount of 3D space an object occupies. Capacity is the amount a container can hold. They are often used interchangeably. For example, a 1000 cubic centimeter (cm³) container has a capacity of 1 liter.'
            }
        ]
    },
    'BMI Calculator': {
        description: 'The Body Mass Index (BMI) calculator is a tool that helps you determine if your weight is in a healthy range for your height. It provides a simple numeric measure of your thinness or fatness.',
        faqs: [
            {
                q: 'What do the BMI categories mean?',
                a: 'BMI categories (Underweight, Normal, Overweight) are broad classifications. While BMI is a useful indicator, it does not account for factors like muscle mass, body composition, or age, so it should be considered as part of a larger health assessment.'
            },
            {
                q: 'Is BMI accurate for everyone?',
                a: 'BMI can be less accurate for certain groups like athletes (who have high muscle mass), pregnant women, the elderly, and children. It\'s best to consult a healthcare professional for a complete health evaluation.'
            }
        ]
    },
    'Age Calculator': {
        description: 'Calculate the exact age of a person, down to the second. This tool also tells you how many days are left until their next birthday. You can save important dates like birthdays and anniversaries for quick calculations in the future.',
        faqs: [
            {
                q: 'How does the calculator handle leap years?',
                a: 'The calculator accurately accounts for leap years by calculating the difference between the two full dates, which inherently includes the extra day in leap years when it falls within the period.'
            },
            {
                q: 'Can I use this for things other than birthdays?',
                a: 'Yes! You can use it to calculate the duration between any two dates. For example, find out exactly how long you\'ve been working at your job or how long it has been since a major life event.'
            }
        ]
    },
    'Unit Converter': {
        description: 'A comprehensive tool to convert between various units of measurement for Length, Mass, and Temperature. Switch between metric and imperial systems with ease.',
        faqs: [
            {
                q: 'Why does temperature conversion seem different?',
                a: 'Length and Mass conversions use simple multiplication factors. Temperature scales (Celsius, Fahrenheit, Kelvin) have different zero points, so their conversion formulas involve both multiplication and addition/subtraction, not just a single factor.'
            },
            {
                q: 'What is the difference between the metric and imperial systems?',
                a: 'The metric system (meter, gram) is a decimal-based system used by most of the world. The imperial system (foot, pound) is historically used in the British Empire and is still standard in the United States for many everyday measurements.'
            }
        ]
    },
    'Currency Converter': {
        description: 'Get a quick estimate of currency exchange rates. This tool uses static, pre-defined rates to show you how one currency converts to another. Please note these are not live rates and should be used for estimation purposes only.',
        faqs: [
            {
                q: 'Why are these not live rates?',
                a: 'Providing live, real-time currency rates requires a subscription to a financial data API, which can be costly. This calculator uses fixed rates as a free-to-use estimation tool.'
            },
            {
                q: 'Why will the actual bank rate be different?',
                a: 'The official exchange rate (mid-market rate) is not what you get from a bank or exchange service. They apply a "spread" or margin to the rate to make a profit, so the rate you get will always be slightly less favorable.'
            }
        ]
    },
    'Fuel Cost Calculator': {
        description: 'Plan your travel budget by calculating the total fuel cost for a trip. Enter the trip distance, your vehicle\'s mileage, and the current price of fuel to get an accurate estimate of your travel expenses.',
        faqs: [
            {
                q: 'How can I improve my vehicle\'s mileage?',
                a: 'You can improve mileage by maintaining proper tire pressure, avoiding aggressive driving (sudden acceleration and braking), reducing excess weight in the car, and keeping your engine well-maintained with regular servicing.'
            },
            {
                q: 'What is "mileage" or "fuel efficiency"?',
                a: 'It is a measure of how far your vehicle can travel on a specific amount of fuel. It is typically expressed in kilometers per liter (km/L) or miles per gallon (MPG).'
            }
        ]
    },
    'Trip Expense Splitter': {
        description: 'Easily split a bill or any shared expense among a group of people. This calculator lets you add a tip and then divides the total cost evenly, showing you the amount each person needs to pay.',
        faqs: [
            {
                q: 'How is the tip calculated?',
                a: 'The tip is calculated as a percentage of the total bill amount before it is split. The calculator then adds this tip amount to the original bill to get the final total, which is then divided by the number of people.'
            },
            {
                q: 'What if someone needs to pay more or less?',
                a: 'This calculator performs an even split. For complex splits where people need to pay different amounts, you would need to calculate each person\'s share manually and then use the Standard Calculator to add them up.'
            }
        ]
    }
};