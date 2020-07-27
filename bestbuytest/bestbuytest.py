from amzsear import AmzSear
amz = AmzSear('Laptop')
last_item = amz.rget(-1) # retrieves the last item in the amzSear
print(last_item)
print(last_item.get_prices())